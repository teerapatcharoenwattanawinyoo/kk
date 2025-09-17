import { SearchInput } from "@/ui/atoms/search-input";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta = {
  title: "Atoms/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    value: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
  },
};

export const WithValue: Story = {
  args: {
    placeholder: "Search...",
    value: "React components",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Search products...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Search...",
    disabled: true,
  },
};

export const WithState: Story = {
  render: () => {
    const [searchValue, setSearchValue] = React.useState("");

    return (
      <div className="w-80">
        <SearchInput
          placeholder="Type to search..."
          value={searchValue}
          onChange={setSearchValue}
        />
        {searchValue && (
          <p className="mt-2 text-sm text-gray-600">
            Searching for: "{searchValue}"
          </p>
        )}
      </div>
    );
  },
};

export const Different_Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="w-60">
        <SearchInput placeholder="Small search..." />
      </div>
      <div className="w-80">
        <SearchInput placeholder="Medium search..." />
      </div>
      <div className="w-96">
        <SearchInput placeholder="Large search..." />
      </div>
    </div>
  ),
};
