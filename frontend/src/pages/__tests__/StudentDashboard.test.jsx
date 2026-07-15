import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import StudentDashboard from "../student/StudentDashboard";

vi.mock("../../services/jobsService", () => ({
  getJobs: vi
    .fn()
    .mockResolvedValue([
      {
        id: "j1",
        title: "Frontend Engineer",
        company: "TechFlow Systems",
        logo: "TF",
        location: "Bengaluru",
        matchScore: 92,
        applicants: 12,
        status: "Active",
      },
    ]),
}));
vi.mock("../../services/applicationsService", () => ({
  getMyApplications: vi
    .fn()
    .mockResolvedValue([
      {
        id: "a1",
        jobTitle: "Frontend Engineer",
        company: "TechFlow Systems",
        appliedAt: "2026-07-01",
        status: "Applied",
        matchScore: 92,
      },
    ]),
}));
vi.mock("../../services/notificationsService", () => ({
  getNotifications: vi
    .fn()
    .mockResolvedValue([
      {
        id: "n1",
        title: "Welcome",
        message: "Thanks for joining",
        type: "info",
        read: false,
        createdAt: "2026-07-08T10:00:00",
      },
    ]),
}));
vi.mock("../../services/interviewsService", () => ({
  getMyInterviews: vi.fn().mockResolvedValue([]),
}));

describe("StudentDashboard", () => {
  it("loads and renders data from the mocked service layer", async () => {
    renderWithProviders(<StudentDashboard />);
    await waitFor(() =>
      expect(screen.getAllByText("Frontend Engineer").length).toBeGreaterThan(
        0,
      ),
    );
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
  });
});
