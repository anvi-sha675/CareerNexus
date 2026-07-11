import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "../EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No jobs" description="Try again later" />);
    expect(screen.getByText("No jobs")).toBeInTheDocument();
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });

  it("fires the action callback", () => {
    const onAction = vi.fn();
    render(<EmptyState actionLabel="Reset" onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
