import { describe, it, expect } from "@jest/globals";
import { parsePagination, buildMeta } from "../../utils/pagination.js";

describe("parsePagination", () => {
  it("defaults page and limit when not provided", () => {
    const result = parsePagination({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(0);
  });

  it("computes skip correctly for a later page", () => {
    const result = parsePagination({ page: "3", limit: "20" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(40);
  });

  it("clamps limit to the maximum allowed", () => {
    const result = parsePagination({ limit: "9999" });
    expect(result.limit).toBe(100);
  });

  it("never returns a page below 1", () => {
    const result = parsePagination({ page: "-5" });
    expect(result.page).toBe(1);
  });
});

describe("buildMeta", () => {
  it("computes totalPages and hasNextPage correctly", () => {
    const meta = buildMeta({ page: 1, limit: 10, total: 25 });
    expect(meta.totalPages).toBe(3);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPrevPage).toBe(false);
  });

  it("reports no next page on the last page", () => {
    const meta = buildMeta({ page: 3, limit: 10, total: 25 });
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPrevPage).toBe(true);
  });
});
