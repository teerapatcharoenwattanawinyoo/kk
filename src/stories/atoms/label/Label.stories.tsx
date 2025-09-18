import { Label } from "@/ui/atoms/label";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label Text",
  },
};

export const WithHtmlFor: Story = {
  args: {
    htmlFor: "email",
    children: "Email Address",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  ),
};

export const Required: Story = {
  args: {
    children: (
      <>
        Email Address <span className="text-destructive">*</span>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Label",
    className: "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <input
        disabled
        type="text"
        placeholder="Disabled input"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  ),
};
