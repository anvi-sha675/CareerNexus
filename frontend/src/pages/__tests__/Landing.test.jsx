import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import Landing from "../public/Landing";

describe("Landing page", () => {
  it("renders the hero heading and primary CTA", () => {
    renderWithProviders(<Landing />);
    expect(
      screen.getByRole("heading", { name: /right role/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started free/i }),
    ).toBeInTheDocument();
  });
});
