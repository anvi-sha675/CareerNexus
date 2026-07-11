import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

function Probe() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{isAuthenticated ? "in" : "out"}</span>
      <span data-testid="name">{user?.name}</span>
      <button onClick={() => login("test@example.com", "student")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => localStorage.clear());

  it("starts unauthenticated", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("out"),
    );
  });

  it("logs in and persists to localStorage", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText("Login"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("in"),
    );
    expect(localStorage.getItem("cn_auth")).toBeTruthy();
  });

  it("logs out and clears storage", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText("Login"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("in"),
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByTestId("status")).toHaveTextContent("out");
    expect(localStorage.getItem("cn_auth")).toBeNull();
  });
});
