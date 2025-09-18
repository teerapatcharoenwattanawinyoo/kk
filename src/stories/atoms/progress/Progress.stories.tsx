import { Progress } from "@/ui/atoms/progress";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
    className: "w-[60%]",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: "w-[60%]",
  },
};

export const Half: Story = {
  args: {
    value: 50,
    className: "w-[60%]",
  },
};

export const Full: Story = {
  args: {
    value: 100,
    className: "w-[60%]",
  },
};

export const Loading: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(13);

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return <Progress value={progress} className="w-[60%]" />;
  },
};
