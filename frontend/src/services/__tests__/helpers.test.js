import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("withFallback", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("skips the network call entirely and returns mock data when VITE_API_URL is not set", async () => {
    vi.stubEnv("VITE_API_URL", "");
    const { withFallback } = await import("../helpers");
    const apiCall = vi.fn();
    const result = await withFallback(apiCall, { mock: true }, 0);
    expect(apiCall).not.toHaveBeenCalled();
    expect(result).toEqual({ mock: true });
  });

  it("falls back to mock data if a configured backend returns an HTML shell instead of JSON", async () => {
    vi.stubEnv("VITE_API_URL", "https://example.com/api");
    const { withFallback } = await import("../helpers");
    const apiCall = vi
      .fn()
      .mockResolvedValue({
        data: "<!DOCTYPE html><html><body>App Shell</body></html>",
      });
    const result = await withFallback(apiCall, { mock: true }, 0);
    expect(apiCall).toHaveBeenCalled();
    expect(result).toEqual({ mock: true });
  });

  it("trusts a real JSON response from a configured backend", async () => {
    vi.stubEnv("VITE_API_URL", "https://example.com/api");
    const { withFallback } = await import("../helpers");
    const apiCall = vi.fn().mockResolvedValue({ data: { real: true } });
    const result = await withFallback(apiCall, { mock: true }, 0);
    expect(result).toEqual({ real: true });
  });

  it("falls back to mock data if the real call rejects outright", async () => {
    vi.stubEnv("VITE_API_URL", "https://example.com/api");
    const { withFallback } = await import("../helpers");
    const apiCall = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await withFallback(apiCall, { mock: true }, 0);
    expect(result).toEqual({ mock: true });
  });
});
