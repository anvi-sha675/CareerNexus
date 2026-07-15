import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatCurrency,
  truncate,
  initials,
  timeAgo,
} from "../formatters";

describe("formatDate", () => {
  it("formats a date string", () => {
    expect(formatDate("2026-07-09")).toMatch(/Jul/);
  });
  it("returns em-dash placeholder for falsy input", () => {
    expect(formatDate(null)).toBe("—");
  });
});

describe("formatCurrency", () => {
  it("formats a number as INR currency", () => {
    expect(formatCurrency(800000)).toContain("8,00,000");
  });
  it("returns placeholder for null", () => {
    expect(formatCurrency(null)).toBe("—");
  });
});

describe("truncate", () => {
  it("leaves short strings untouched", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });
  it("truncates long strings with an ellipsis", () => {
    const long = "a".repeat(200);
    expect(truncate(long, 120).endsWith("…")).toBe(true);
    expect(truncate(long, 120).length).toBeLessThanOrEqual(121);
  });
});

describe("initials", () => {
  it("builds initials from a full name", () => {
    expect(initials("Anvesha")).toBe("AS");
  });
  it("handles a single name", () => {
    expect(initials("Anvesha")).toBe("A");
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for the current instant", () => {
    expect(timeAgo(new Date())).toBe("just now");
  });
  it("returns a relative string for a past date", () => {
    const past = new Date(Date.now() - 2 * 3600 * 1000);
    expect(timeAgo(past)).toMatch(/hour/);
  });
});
