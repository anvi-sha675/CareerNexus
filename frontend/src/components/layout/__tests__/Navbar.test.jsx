import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../../context/ThemeContext";
import { ToastProvider } from "../../../context/ToastContext";
import { AuthProvider } from "../../../context/AuthContext";
import { render } from "@testing-library/react";
import Navbar from "../Navbar";

function renderNavbar({ authedAs } = {}) {
  if (authedAs) {
    localStorage.setItem(
      "cn_auth",
      JSON.stringify({
        user: { name: "Test User", role: authedAs },
        token: "demo-token",
      }),
    );
  } else {
    localStorage.clear();
  }
  return render(
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>,
  );
}

describe("Navbar", () => {
  it("shows the Jobs link to a guest", () => {
    renderNavbar();
    expect(screen.getAllByText("Jobs").length).toBeGreaterThan(0);
  });

  it("shows the Jobs link to an authenticated student", async () => {
    renderNavbar({ authedAs: "student" });
    expect(await screen.findAllByText("Jobs")).not.toHaveLength(0);
  });

  it("hides the Jobs link from an authenticated recruiter", async () => {
    renderNavbar({ authedAs: "recruiter" });
    await screen.findByText("Dashboard");
    expect(screen.queryByText("Jobs")).not.toBeInTheDocument();
  });

  it("hides the Jobs link from an authenticated admin", async () => {
    renderNavbar({ authedAs: "admin" });
    await screen.findByText("Dashboard");
    expect(screen.queryByText("Jobs")).not.toBeInTheDocument();
  });
});
