import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

async function clickLinkTo(container, href) {
  const link = await waitFor(() => {
    const el = container.querySelector(`a[href="${href}"]`);
    if (!el) throw new Error(`No link with href="${href}" found yet`);
    return el;
  });
  fireEvent.click(link);
}

describe("Top-level navigation", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("clicking 'Jobs' in the public navbar while logged out goes to Login, not an error page", async () => {
    const { container } = render(<App />);
    await clickLinkTo(container, "/jobs");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /welcome back/i }),
      ).toBeInTheDocument(),
    );
  });

  it("logging in as a recruiter after being redirected from /jobs lands on Jobs, not a 403", async () => {
    const { container } = render(<App />);
    await clickLinkTo(container, "/jobs");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /welcome back/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("recruiter"));
    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "recruiter@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(window.location.pathname).toBe("/jobs"), {
      timeout: 3000,
    });
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Browse Jobs" }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByText(/don't have access to this page/i),
    ).not.toBeInTheDocument();
  });

  it("logging in as a student lands on the Student Dashboard, not a 404", async () => {
    const { container } = render(<App />);
    await clickLinkTo(container, "/login");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /welcome back/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "student@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(
      () => expect(window.location.pathname).toBe("/student/dashboard"),
      { timeout: 3000 },
    );
    expect(
      screen.queryByText("This page went missing"),
    ).not.toBeInTheDocument();
  });

  it("registering a new student account lands on the Student Dashboard, not an error page", async () => {
    const { container } = render(<App />);
    await clickLinkTo(container, "/register");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /create your account/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/Full name/), {
      target: { value: "Anvesha Sharma" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "anvesha@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.click(screen.getByLabelText(/I agree to the/));
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(
      () => expect(window.location.pathname).toBe("/student/dashboard"),
      { timeout: 3000 },
    );
    expect(
      screen.queryByText("This page went missing"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/don't have access to this page/i),
    ).not.toBeInTheDocument();
  });

  it("an authenticated user clicking 'Dashboard' from a public page reaches their dashboard", async () => {
    localStorage.setItem(
      "cn_auth",
      JSON.stringify({
        user: { id: "u1", name: "Anvesha", email: "a@b.com", role: "student" },
        token: "demo-token-student",
      }),
    );
    window.history.pushState({}, "", "/about");
    const { container } = render(<App />);
    await clickLinkTo(container, "/student/dashboard");
    await waitFor(() =>
      expect(window.location.pathname).toBe("/student/dashboard"),
    );
    expect(
      screen.queryByText("This page went missing"),
    ).not.toBeInTheDocument();
  });

  it("visiting /jobs directly as any authenticated role renders the Jobs page cleanly", async () => {
    for (const role of ["student", "recruiter", "admin"]) {
      localStorage.setItem(
        "cn_auth",
        JSON.stringify({
          user: { id: "u1", name: "Test User", email: "a@b.com", role },
          token: `demo-token-${role}`,
        }),
      );
      window.history.pushState({}, "", "/jobs");
      const { container, unmount } = render(<App />);
      await waitFor(() =>
        expect(
          screen.getByRole("heading", { name: "Browse Jobs" }),
        ).toBeInTheDocument(),
      );
      const hasFooter = !!container.querySelector("footer");
      const hasSidebar = !!container.querySelector("aside");
      expect(hasFooter && hasSidebar).toBe(false);
      unmount();
    }
  });

  it("registering a new recruiter account lands on the Recruiter Dashboard, not an error page", async () => {
    const { container } = render(<App />);
    await clickLinkTo(container, "/register");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /create your account/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("I'm a Recruiter"));
    fireEvent.change(screen.getByLabelText(/Full name/), {
      target: { value: "Rohan Mehta" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "rohan@techflowsystems.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.click(screen.getByLabelText(/I agree to the/));
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(
      () => expect(window.location.pathname).toBe("/recruiter/dashboard"),
      { timeout: 3000 },
    );
    expect(
      screen.queryByText("This page went missing"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/don't have access to this page/i),
    ).not.toBeInTheDocument();
  });

  it("visiting a route outside the current role shows Forbidden, not a blank page or crash", async () => {
    localStorage.setItem(
      "cn_auth",
      JSON.stringify({
        user: {
          id: "u1",
          name: "Test User",
          email: "a@b.com",
          role: "student",
        },
        token: "demo-token-student",
      }),
    );
    window.history.pushState({}, "", "/admin/dashboard");
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByText(/don't have access to this page/i),
      ).toBeInTheDocument(),
    );
  });
});
