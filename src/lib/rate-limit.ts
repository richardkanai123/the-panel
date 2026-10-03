import { createHash } from "node:crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const SESSION_LIMIT = 3;
export const SESSION_WINDOW = "24 h" as const;

function redisRestUrl(): string | undefined {
  return (
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim()
  );
}

function redisRestToken(): string | undefined {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim()
  );
}

export function isRateLimitConfigured(): boolean {
  return Boolean(redisRestUrl() && redisRestToken());
}

let redisClient: Redis | undefined;
let sessionRateLimitClient: Ratelimit | undefined;

function getRedis(): Redis {
  if (!redisClient) {
    redisClient = Redis.fromEnv();
  }
  return redisClient;
}

function getSessionRateLimit(): Ratelimit {
  if (!sessionRateLimitClient) {
    sessionRateLimitClient = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(SESSION_LIMIT, SESSION_WINDOW),
      prefix: "the-panel:session",
    });
  }
  return sessionRateLimitClient;
}

function isRedisConnectivityError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  const cause = error.cause;
  const causeCode =
    cause instanceof Error && "code" in cause
      ? String((cause as NodeJS.ErrnoException).code)
      : "";
  return (
    error.message.includes("fetch failed") ||
    causeCode === "ENOTFOUND" ||
    causeCode === "ECONNREFUSED" ||
    causeCode === "ETIMEDOUT"
  );
}

function skipRateLimitOnRedisFailure(error: unknown): boolean {
  if (!isRedisConnectivityError(error)) {
    return false;
  }
  console.warn(
    "[rate-limit] Redis unavailable; skipping session limits.",
    error instanceof Error ? error.message : error,
  );
  return true;
}

const SESSION_ACTIVE_PREFIX = "the-panel:session-active";
const SESSION_TTL_SECONDS = 60 * 60 * 24;

function sessionFingerprint(ip: string, idea: string): string {
  const normalized = idea.trim().toLowerCase();
  const hash = createHash("sha256")
    .update(normalized)
    .digest("hex")
    .slice(0, 16);
  return `${ip}:${hash}`;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitResponse(reset: number) {
  return Response.json(
    {
      error: `You've used your ${SESSION_LIMIT} free pitches for today. Come back tomorrow.`,
      code: "RATE_LIMITED",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
      },
    },
  );
}

export async function checkSessionRateLimit(
  request: Request,
  idea: string,
): Promise<Response | null> {
  if (!isRateLimitConfigured()) {
    return null;
  }

  const ip = getClientIp(request);
  const activeKey = `${SESSION_ACTIVE_PREFIX}:${sessionFingerprint(ip, idea)}`;

  try {
    const redis = getRedis();
    const existing = await redis.get(activeKey);
    if (existing) {
      return null;
    }

    const { success, reset } = await getSessionRateLimit().limit(ip);
    if (!success) {
      return rateLimitResponse(reset);
    }

    await redis.set(activeKey, "1", { ex: SESSION_TTL_SECONDS });
    return null;
  } catch (error) {
    if (skipRateLimitOnRedisFailure(error)) {
      return null;
    }
    throw error;
  }
}
