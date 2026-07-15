import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import AdminDashboard from "../admin/AdminDashboard";

vi.mock("../../services/analyticsService", () => ({
  getPlatformAnalytics: vi.fn().mockResolvedValue({
    revenueByMonth: [{ month: "Jun", value: 90 }],
    applicationsTrend: [{ month: "Jun", applications: 300, hires: 20 }],
    userDistribution: [{ name: "Students", value: 100 }],
    pipelineData: [{ stage: "Applied", count: 100 }],
  }),
}));
vi.mock("../../services/usersService", () => ({
  getRecruiters: vi
    .fn()
    .mockResolvedValue([
      {
        id: "r1",
        company: "NimbusCloud",
        contact: "Karan Singh",
        email: "karan@nimbuscloud.io",
        status: "Pending",
        jobsPosted: 0,
        joinedAt: "2026-06-30",
      },
    ]),
}));

describe("AdminDashboard", () => {
  it("renders the pending recruiter approval queue from the mock backend", async () => {
    renderWithProviders(<AdminDashboard />);
    await waitFor(() =>
      expect(screen.getByText("NimbusCloud")).toBeInTheDocument(),
    );
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });
});
