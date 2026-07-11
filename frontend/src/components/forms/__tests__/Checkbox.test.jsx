import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "../Checkbox";

describe("Checkbox", () => {
  it("renders with a label and toggles", () => {
    const onChange = vi.fn();
    render(
      <Checkbox name="remember" label="Remember me" onChange={onChange} />,
    );
    const checkbox = screen.getByLabelText("Remember me");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});
