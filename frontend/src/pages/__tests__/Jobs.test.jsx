import { describe, it, expect, vi } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import Jobs from "../student/Jobs";

vi.mock("../../services/jobsService", () => ({
  getJobs: vi.fn().mockResolvedValue([
    {
      id: "j1",
      title: "Frontend Engineer",
      company: "TechFlow Systems",
      logo: "TF",
      location: "Bengaluru, IN",
      type: "Full-time",
      remote: true,
      salaryMin: 800000,
      salaryMax: 1400000,
      experience: "Entry Level",
      postedAt: "2026-06-28",
      tags: ["React"],
      matchScore: 92,
      applicants: 134,
      status: "Active",
    },
    {
      id: "j2",
      title: "Backend Developer",
      company: "NimbusCloud",
      logo: "NC",
      location: "Hyderabad, IN",
      type: "Full-time",
      remote: false,
      salaryMin: 900000,
      salaryMax: 1600000,
      experience: "Mid Level",
      postedAt: "2026-06-25",
      tags: ["Node.js"],
      matchScore: 70,
      applicants: 88,
      status: "Active",
    },
  ]),
}));

describe("Jobs page", () => {
  it("renders job cards from the mock backend", async () => {
    renderWithProviders(<Jobs />);
    await waitFor(() =>
      expect(screen.getByText("Frontend Engineer")).toBeInTheDocument(),
    );
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });

  it("filters jobs by search query", async () => {
    renderWithProviders(<Jobs />);
    await waitFor(() =>
      expect(screen.getByText("Frontend Engineer")).toBeInTheDocument(),
    );
    fireEvent.change(screen.getByPlaceholderText(/Search by title/), {
      target: { value: "Backend" },
    });
    await waitFor(() =>
      expect(screen.queryByText("Frontend Engineer")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });
});
