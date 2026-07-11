import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Table from "../Table";

const columns = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
];

describe("Table", () => {
  it("shows the empty state when there are no rows", () => {
    render(
      <Table columns={columns} rows={[]} emptyProps={{ title: "No data" }} />,
    );
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders rows and headers", () => {
    render(
      <Table
        columns={columns}
        rows={[{ id: 1, name: "Anvesha", role: "Student" }]}
      />,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Anvesha")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
  });

  it("shows skeleton rows while loading", () => {
    const { container } = render(<Table columns={columns} rows={[]} loading />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });
});
