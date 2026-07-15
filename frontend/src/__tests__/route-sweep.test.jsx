import { describe, it, expect, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import App from "../App";

const ERROR_BOUNDARY_TEXT = "Something broke on our end";
const NOT_FOUND_TEXT = "This page went missing";
const FORBIDDEN_TEXT = "You don't have access to this page";

async function expectRouteRenders(
  path,
  { allow404 = false, allow403 = false } = {},
) {
  window.history.pushState({}, "", path);
  render(<App />);

  await waitFor(
    () => {
      const text = document.body.textContent;
      expect(text.includes("Loading")).toBe(false);
      expect(
        text.trim().length,
        `${path} rendered no visible content`,
      ).toBeGreaterThan(0);
      expect(
        text.includes(ERROR_BOUNDARY_TEXT),
        `${path} hit the ErrorBoundary`,
      ).toBe(false);
      if (!allow404)
        expect(
          text.includes(NOT_FOUND_TEXT),
          `${path} unexpectedly 404'd`,
        ).toBe(false);
      if (!allow403)
        expect(
          text.includes(FORBIDDEN_TEXT),
          `${path} unexpectedly 403'd`,
        ).toBe(false);
    },
    { timeout: 4000 },
  );
}

function loginAs(role) {
  localStorage.setItem(
    "cn_auth",
    JSON.stringify({
      user: { id: "u1", name: "Test User", email: "test@example.com", role },
      token: `demo-token-${role}`,
    }),
  );
}

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/features",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/maintenance",
];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const SHARED_ROUTES = ["/settings", "/messages", "/jobs", "/jobs/j1"];

const STUDENT_ROUTES = [
  "/student/dashboard",
  "/student/profile",
  "/student/skills",
  "/student/education",
  "/student/experience",
  "/student/projects",
  "/student/certifications",
  "/student/resume-builder",
  "/student/resume-upload",
  "/student/resume-parser-result",
  "/student/applications",
  "/student/applications/a1",
  "/student/saved-jobs",
  "/student/interview-schedule",
  "/student/notifications",
];

const RECRUITER_ROUTES = [
  "/recruiter/dashboard",
  "/recruiter/company-profile",
  "/recruiter/create-job",
  "/recruiter/edit-job/j1",
  "/recruiter/job-management",
  "/recruiter/applicants",
  "/recruiter/applicants/ap1",
  "/recruiter/candidates/ap1",
  "/recruiter/candidate-comparison",
  "/recruiter/matching-dashboard",
  "/recruiter/interview-schedule",
  "/recruiter/analytics",
];

const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/manage-users",
  "/admin/recruiters",
  "/admin/company-verification",
  "/admin/job-moderation",
  "/admin/platform-analytics",
  "/admin/reports",
  "/admin/system-settings",
  "/admin/system-health",
  "/admin/database-status",
  "/admin/feedback",
];

describe("Full route sweep — every registered route must render, not error", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("every public route renders without auth", async () => {
    for (const path of PUBLIC_ROUTES) {
      await expectRouteRenders(path);
      cleanup();
    }
  }, 30000);

  it("every auth route renders without auth", async () => {
    for (const path of AUTH_ROUTES) {
      await expectRouteRenders(path);
      cleanup();
    }
  }, 30000);

  it("every student route renders for a logged-in student", async () => {
    loginAs("student");
    for (const path of [...STUDENT_ROUTES, ...SHARED_ROUTES]) {
      await expectRouteRenders(path);
      cleanup();
    }
  }, 60000);

  it("every recruiter route renders for a logged-in recruiter", async () => {
    loginAs("recruiter");
    for (const path of [...RECRUITER_ROUTES, ...SHARED_ROUTES]) {
      await expectRouteRenders(path);
      cleanup();
    }
  }, 60000);

  it("every admin route renders for a logged-in admin", async () => {
    loginAs("admin");
    for (const path of [...ADMIN_ROUTES, ...SHARED_ROUTES]) {
      await expectRouteRenders(path);
      cleanup();
    }
  }, 60000);

  it("cross-role routes correctly show Forbidden rather than crashing or 404ing", async () => {
    loginAs("student");
    await expectRouteRenders("/admin/dashboard", { allow403: true });
    expect(document.body.textContent.includes(FORBIDDEN_TEXT)).toBe(true);
    cleanup();

    loginAs("recruiter");
    await expectRouteRenders("/student/dashboard", { allow403: true });
    expect(document.body.textContent.includes(FORBIDDEN_TEXT)).toBe(true);
    cleanup();

    loginAs("admin");
    await expectRouteRenders("/recruiter/dashboard", { allow403: true });
    expect(document.body.textContent.includes(FORBIDDEN_TEXT)).toBe(true);
  }, 30000);

  it("an unknown path shows the 404 page, not a crash", async () => {
    await expectRouteRenders("/this-route-does-not-exist", { allow404: true });
    expect(document.body.textContent.includes(NOT_FOUND_TEXT)).toBe(true);
  }, 10000);

  it("protected routes redirect an unauthenticated visitor to Login rather than erroring", async () => {
    for (const path of [
      "/student/dashboard",
      "/recruiter/dashboard",
      "/admin/dashboard",
      "/settings",
      "/messages",
      "/jobs",
    ]) {
      window.history.pushState({}, "", path);
      render(<App />);
      await waitFor(() => expect(window.location.pathname).toBe("/login"), {
        timeout: 4000,
      });
      expect(document.body.textContent.includes(ERROR_BOUNDARY_TEXT)).toBe(
        false,
      );
      cleanup();
    }
  }, 30000);
});
