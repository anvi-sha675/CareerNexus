import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TextField from "../TextField";

describe("TextField", () => {
  it("renders a label and links it to the input", () => {
    render(<TextField label="Email address" name="email" />);
    const input = screen.getByLabelText(/Email address/);
    expect(input).toBeInTheDocument();
  });

  it("shows an error message and marks aria-invalid", () => {
    render(<TextField label="Email" name="email" error="Email is required" />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("toggles password visibility", () => {
    render(
      <TextField
        label="Password"
        name="password"
        type="password"
        defaultValue="secret123"
      />,
    );
    const input = screen.getByLabelText(/Password/);
    expect(input).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByLabelText(/Show password/));
    expect(input).toHaveAttribute("type", "text");
  });

  it("calls onChange handlers", () => {
    const onChange = vi.fn();
    render(<TextField label="Name" name="name" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: "Anvesha" },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
