import { describe, it, expect } from "@jest/globals";
import { renderPdfToBuffer, sectionHeading } from "../../utils/pdfBuilder.js";

describe("renderPdfToBuffer", () => {
  it("produces a valid PDF buffer", async () => {
    const buffer = await renderPdfToBuffer((doc) => {
      doc.fontSize(20).text("Test Resume");
      sectionHeading(doc, "Experience");
      doc.fontSize(10).text("Software Engineer at TechCorp");
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(100);
    // Every valid PDF starts with this magic header.
    expect(buffer.slice(0, 5).toString()).toBe("%PDF-");
  });

  it("rejects when the draw function throws", async () => {
    await expect(
      renderPdfToBuffer(() => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });

  it("handles an empty document gracefully", async () => {
    const buffer = await renderPdfToBuffer(() => {});
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.slice(0, 5).toString()).toBe("%PDF-");
  });
});
