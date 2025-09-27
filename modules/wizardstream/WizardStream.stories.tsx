import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { WizardStream, WizardStreamProps } from "./WizardStream";

const meta: Meta<typeof WizardStream> = {
  title: "Modules/WizardStream",
  component: WizardStream,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof WizardStream>;

export const Default: Story = {
  args: {
    content: { type: "svg", data: "<svg width='100' height='100'><circle cx='50' cy='50' r='40' fill='blue' /></svg>" },
    onEdit: (data: string) => alert(`Edited: ${data}`),
  },
};
