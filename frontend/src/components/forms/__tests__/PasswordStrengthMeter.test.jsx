import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PasswordStrengthMeter from "../PasswordStrengthMeter";

describe("PasswordStrengthMeter", () => {
  it("renders nothing without a password", () => {
    const { container } = render(<PasswordStrengthMeter password="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a strength label for a password", () => {
    render(<PasswordStrengthMeter password="Str0ng!Password123" />);
    expect(screen.getByText(/Password strength/)).toBeInTheDocument();
  });
});
