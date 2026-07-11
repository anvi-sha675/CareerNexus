import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it("paginates items by page size", () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.pageItems).toHaveLength(10);
    expect(result.current.totalPages).toBe(3);
  });

  it("advances to the next page", () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    expect(result.current.pageItems[0]).toBe(11);
  });

  it("clamps to the last valid page when items shrink", () => {
    const { result, rerender } = renderHook(
      ({ list }) => usePagination(list, 10),
      { initialProps: { list: items } },
    );
    act(() => result.current.setPage(3));
    rerender({ list: items.slice(0, 5) });
    expect(result.current.page).toBe(1);
  });
});
