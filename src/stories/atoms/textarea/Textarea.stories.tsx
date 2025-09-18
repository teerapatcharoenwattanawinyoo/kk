import { Textarea } from "@/ui/atoms/textarea";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const WithValue = {
  args: {
    value: "This is some example text in the textarea.",
    placeholder: "Type your message here...",
  },
};

export const Disabled = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
  },
};

export const WithRows = {
  args: {
    placeholder: "This textarea has 6 rows",
    rows: 6,
  },
};

export const Required = {
  args: {
    placeholder: "This field is required",
    required: true,
  },
};

export const WithLabel = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <label htmlFor="bio" className="text-sm font-medium leading-none">
        Bio
      </label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
};

export const WithError = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <label htmlFor="message" className="text-sm font-medium leading-none">
        Message
      </label>
      <Textarea
        id="message"
        placeholder="Your message..."
        className="border-destructive focus-visible:ring-destructive"
      />
      <p className="text-sm text-destructive">This field is required.</p>
    </div>
  ),
};
