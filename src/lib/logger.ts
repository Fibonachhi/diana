export type LogLevel = "info" | "warn" | "error";

export function logClient(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    context,
    ts: new Date().toISOString(),
  };

  if (level === "error") console.error("[plus-one]", payload);
  else if (level === "warn") console.warn("[plus-one]", payload);
  else console.info("[plus-one]", payload);

  void fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // no-op
  });
}

export function logServer(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    context,
    ts: new Date().toISOString(),
  };

  if (level === "error") console.error("[plus-one]", payload);
  else if (level === "warn") console.warn("[plus-one]", payload);
  else console.info("[plus-one]", payload);
}
