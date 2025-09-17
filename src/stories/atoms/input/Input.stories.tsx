import { Input } from "@/ui/atoms/input";
import { Label } from "@/ui/atoms/label";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" placeholder="Enter your email" type="email" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        placeholder="Enter password"
        type="password"
        className="border-destructive"
      />
      <p className="text-sm text-destructive">
        Password must be at least 8 characters
      </p>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter username" />
      <p className="text-sm text-muted-foreground">
        Username must be unique and contain only letters and numbers
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="disabled">Disabled Input</Label>
      <Input id="disabled" placeholder="This input is disabled" disabled />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="password-field">Password</Label>
      <Input
        id="password-field"
        type="password"
        placeholder="Enter your password"
      />
    </div>
  ),
};

export const Number: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="age">Age</Label>
      <Input
        id="age"
        type="number"
        placeholder="Enter your age"
        min={0}
        max={120}
      />
    </div>
  ),
};
