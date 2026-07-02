type ApiErrorBody = {
  error?: unknown;
  code?: unknown;
};

export function parseApiErrorMessage(message: string): string {
  const trimmed = message.trim();

  if (!trimmed.startsWith("{")) {
    return message;
  }

  try {
    const parsed = JSON.parse(trimmed) as ApiErrorBody;
    if (typeof parsed.error === "string" && parsed.error.length > 0) {
      return parsed.error;
    }
  } catch {
    // Fall through to the raw message.
  }

  return message;
}

export function isRateLimitError(message: string): boolean {
  const trimmed = message.trim();

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as ApiErrorBody;
      return parsed.code === "RATE_LIMITED";
    } catch {
      // Fall through.
    }
  }

  return message.includes("free pitches");
}
