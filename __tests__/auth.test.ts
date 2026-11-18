import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { openAppDb, setAppDbForTests } from "@/lib/appDb";
import {
  LOGIN_TOKEN_TTL_MS,
  consumeLoginToken,
  createLoginToken,
  deleteSession,
  appUrl,
  getUserBySessionToken,
  safeNext,
} from "@/lib/auth";

beforeEach(() => {
  setAppDbForTests(openAppDb(":memory:"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("magic link tokens", () => {
  it("creates a user and session on first use", () => {
    const token = createLoginToken("  Alice@Example.com ");
    const session = consumeLoginToken(token)!;
    expect(session).not.toBeNull();
    const user = getUserBySessionToken(session.sessionToken)!;
    expect(user.email).toBe("alice@example.com");
  });

  it("reuses the same user on later logins", () => {
    const a = consumeLoginToken(createLoginToken("alice@example.com"))!;
    const b = consumeLoginToken(createLoginToken("ALICE@example.com"))!;
    expect(a.userId).toBe(b.userId);
  });

  it("tokens are single use", () => {
    const token = createLoginToken("alice@example.com");
    expect(consumeLoginToken(token)).not.toBeNull();
    expect(consumeLoginToken(token)).toBeNull();
  });

  it("tokens expire", () => {
    vi.useFakeTimers();
    const token = createLoginToken("alice@example.com");
    vi.advanceTimersByTime(LOGIN_TOKEN_TTL_MS + 1);
    expect(consumeLoginToken(token)).toBeNull();
  });

  it("rejects unknown tokens and sessions", () => {
    expect(consumeLoginToken("nope")).toBeNull();
    expect(getUserBySessionToken("nope")).toBeNull();
    expect(getUserBySessionToken(undefined)).toBeNull();
  });

  it("logout deletes the session", () => {
    const { sessionToken } = consumeLoginToken(createLoginToken("alice@example.com"))!;
    deleteSession(sessionToken);
    expect(getUserBySessionToken(sessionToken)).toBeNull();
  });
});

describe("safeNext", () => {
  it("allows relative paths only", () => {
    expect(safeNext("/athletes/emer-breen")).toBe("/athletes/emer-breen");
    expect(safeNext("https://evil.example")).toBe("/");
    expect(safeNext("//evil.example")).toBe("/");
    expect(safeNext("/\\evil.example")).toBe("/");
    expect(safeNext(null)).toBe("/");
  });
});

describe("appUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("uses APP_URL and strips trailing slashes", () => {
    vi.stubEnv("APP_URL", "https://trykastats.com//");
    expect(appUrl()).toBe("https://trykastats.com");
  });

  it("falls back to localhost when unset", () => {
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("NODE_ENV", "test");
    delete process.env.APP_URL;
    expect(appUrl()).toBe("http://localhost:3000");
  });
});
