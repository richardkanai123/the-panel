import { createHash } from "node:crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const SESSION_LIMIT = 3;
export const SESSION_WINDOW = "24 h" as const;

export const sessionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(SESSION_LIMIT, SESSION_WINDOW),
  prefix: "the-panel:session",
});

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
  const ip = getClientIp(request);
  const activeKey = `${SESSION_ACTIVE_PREFIX}:${sessionFingerprint(ip, idea)}`;

  const existing = await redis.get(activeKey);
  if (existing) {
    return null;
  }

  const { success, reset } = await sessionRateLimit.limit(ip);
  if (!success) {
    return rateLimitResponse(reset);
  }

  await redis.set(activeKey, "1", { ex: SESSION_TTL_SECONDS });
  return null;
}
