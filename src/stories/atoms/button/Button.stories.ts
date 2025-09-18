import { Button } from "@/ui/atoms/button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

export const Default = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Destructive = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

export const Outline = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Secondary = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Ghost = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link = {
  args: {
    children: "Link",
    variant: "link",
  },
};

export const Small = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Large = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Icon = {
  args: {
    children: "💖",
    size: "icon",
  },
};

export const Disabled = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
