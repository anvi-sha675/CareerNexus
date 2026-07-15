import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import Login from "../auth/Login";

describe("Login page", () => {
  it("renders the form and validates required fields", async () => {
    renderWithProviders(<Login />);
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() =>
      expect(screen.getByText("Email is required")).toBeInTheDocument(),
    );
  });

  it("logs in successfully against the mock backend", async () => {
    renderWithProviders(<Login />);
    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "anvesha@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() => expect(localStorage.getItem("cn_auth")).toBeTruthy(), {
      timeout: 3000,
    });
  });
});
