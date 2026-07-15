import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportToCSV } from "../exportCsv";

describe("exportToCSV", () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => "blob:mock");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("returns false and does nothing for empty rows", () => {
    expect(exportToCSV("file", [], [{ key: "a", header: "A" }])).toBe(false);
  });

  it("triggers a download for non-empty rows", () => {
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      if (tag === "a") el.click = clickSpy;
      return el;
    });

    const ok = exportToCSV(
      "applicants",
      [{ name: "Anvesha", email: "a@b.com" }],
      [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
      ],
    );

    expect(ok).toBe(true);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    document.createElement.mockRestore();
  });
});
