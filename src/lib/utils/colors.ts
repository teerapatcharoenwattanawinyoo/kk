export const colors = {
  // Primary colors
  primary: {
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#355FF5",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Success colors
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  // Warning colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Error colors
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Neutral colors
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    525: "#8094AE", // Footer text color
    550: "#606266", // Custom text color
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Team card specific colors
  teamCard: {
    background: "#ffffff",
    border: "#e2e8f0",
    shadow: "rgba(0, 0, 0, 0.08)",

    // Header colors
    header: {
      title: "#3F567F",
      subtitle: "#64748b",
    },

    // Avatar/Profile colors
    profile: {
      background: "#D0DAFF",
      text: "#3F567F",
    },

    // Badge colors
    badge: {
      background: "#dbeafe",
      text: "#1d4ed8",
      border: "#bfdbfe",
      dot: "#3b82f6",
    },
  },

  // Wallet colors
  wallet: {
    label: "#64748b",
    amount: "#ffffff",
    background: "#1D46DB",
  },

  // Stats colors
  stats: {
    label: "#64748b",
    value: "#355FF5",
  },

  // Button colors
  button: {
    primary: "#355FF5",
    primaryHover: "#2563eb",
    primaryText: "#ffffff",
  },

  // Search input colors
  search: {
    background: "#ECF2F8",
    border: "#e2e8f0",
    placeholder: "#9ca3af",
    icon: "#9ca3af",
    disabled: {
      background: "#f9fafb",
      border: "#f3f4f6",
      text: "#d1d5db",
      icon: "#d1d5db",
    },
  },

  // Input colors
  input: {
    background: "#ffffff",
    border: "#e2e8f0",
    text: "#374151",
    placeholder: "#9ca3af",
    focus: {
      border: "#2563eb",
      ring: "#60a5fa",
    },
    disabled: {
      background: "#f9fafb",
      border: "#f3f4f6",
      text: "#d1d5db",
    },
  },
} as const;

export type ColorPalette = typeof colors;
export type ColorKey = keyof ColorPalette;
