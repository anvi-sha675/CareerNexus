import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastProvider, useToast } from "../ToastContext";

function Probe() {
  const { showToast } = useToast();
  return (
    <button
      onClick={() =>
        showToast("Saved successfully", { type: "success", title: "Success" })
      }
    >
      Fire
    </button>
  );
}

describe("ToastContext", () => {
  it("shows a toast when triggered", () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("dismisses a toast when its close button is clicked", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    fireEvent.click(screen.getByLabelText("Dismiss notification"));
    await waitFor(() =>
      expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument(),
    );
  });
});
