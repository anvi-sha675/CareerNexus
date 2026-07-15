import { describe, it, expect } from "vitest";
import { isEmail, passwordStrength, required } from "../validators";

describe("isEmail", () => {
  it("accepts valid emails", () => {
    expect(isEmail("test@example.com")).toBe(true);
  });
  it("rejects invalid emails", () => {
    expect(isEmail("not-an-email")).toBe(false);
    expect(isEmail("")).toBe(false);
  });
});

describe("passwordStrength", () => {
  it("scores a weak password low", () => {
    expect(passwordStrength("abc").score).toBeLessThanOrEqual(1);
  });
  it("scores a strong password high", () => {
    expect(passwordStrength("Str0ng!Password123").score).toBeGreaterThanOrEqual(
      4,
    );
  });
});

describe("required", () => {
  it("fails on empty string", () => {
    expect(required("")).not.toBe(true);
  });
  it("passes on a real value", () => {
    expect(required("hello")).toBe(true);
  });
});
