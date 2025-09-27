import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WizardStream, { WizardStreamProps } from "./WizardStream";

describe("WizardStream", () => {
  const defaultProps: WizardStreamProps = {
    content: { type: "svg", data: "<svg width='100' height='100'><circle cx='50' cy='50' r='40' fill='blue' /></svg>" },
    onEdit: jest.fn(),
  };

  it("renders SVG preview", () => {
    render(<WizardStream {...defaultProps} />);
    expect(screen.getByTestId("wizardstream-preview")).toBeInTheDocument();
  });

  it("calls onEdit when textarea is blurred", () => {
    render(<WizardStream {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Edit SVG markup here");
    fireEvent.blur(textarea, { target: { value: "<svg></svg>" } });
    expect(defaultProps.onEdit).toHaveBeenCalledWith("<svg></svg>");
  });
});
