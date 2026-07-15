import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import Applicants from "../recruiter/Applicants";

vi.mock("../../services/applicationsService", () => ({
  getApplicantsForJob: vi
    .fn()
    .mockResolvedValue([
      {
        id: "ap1",
        name: "Ishaan Verma",
        jobTitle: "Frontend Engineer",
        appliedAt: "2026-06-29",
        status: "Interview",
        matchScore: 92,
        email: "ishaan.v@example.com",
      },
    ]),
  updateApplicationStatus: vi.fn().mockResolvedValue({}),
}));

describe("Applicants page", () => {
  it("renders applicants from the mock backend", async () => {
    renderWithProviders(<Applicants />);
    await waitFor(() =>
      expect(screen.getByText("Ishaan Verma")).toBeInTheDocument(),
    );
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });
});
