import { describe, it, expect } from "@jest/globals";
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateRawAndHashedToken,
  hashToken,
} from "../../utils/tokens.js";

describe("tokens", () => {
  it("signs and verifies an access token round-trip", () => {
    const token = signAccessToken({ id: "abc123", role: "student" });
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe("abc123");
    expect(decoded.role).toBe("student");
  });

  it("signs and verifies a refresh token round-trip", () => {
    const token = signRefreshToken({ id: "xyz789" });
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe("xyz789");
  });

  it("rejects a tampered token", () => {
    const token = signAccessToken({ id: "abc123" });
    expect(() => verifyAccessToken(`${token}tampered`)).toThrow();
  });

  it("generates a raw token whose hash matches hashToken()", () => {
    const { raw, hashed } = generateRawAndHashedToken();
    expect(hashToken(raw)).toBe(hashed);
    expect(raw).not.toBe(hashed);
    expect(raw.length).toBeGreaterThan(32);
  });
});
