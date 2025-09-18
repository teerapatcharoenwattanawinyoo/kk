// Avatar color variants with hex values
const avatarColors = [
  {
    bgClass: "bg-blue-500",
    bgHex: "#3b82f6",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-green-500",
    bgHex: "#10b981",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-purple-500",
    bgHex: "#8b5cf6",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-pink-500",
    bgHex: "#ec4899",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-indigo-500",
    bgHex: "#6366f1",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-red-500",
    bgHex: "#ef4444",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-yellow-500",
    bgHex: "#eab308",
    textClass: "text-gray-900",
    textHex: "#111827",
  },
  {
    bgClass: "bg-orange-500",
    bgHex: "#f97316",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-teal-500",
    bgHex: "#14b8a6",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-cyan-500",
    bgHex: "#06b6d4",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-emerald-500",
    bgHex: "#10b981",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-lime-500",
    bgHex: "#84cc16",
    textClass: "text-gray-900",
    textHex: "#111827",
  },
  {
    bgClass: "bg-rose-500",
    bgHex: "#f43f5e",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-fuchsia-500",
    bgHex: "#d946ef",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-violet-500",
    bgHex: "#8b5cf6",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-sky-500",
    bgHex: "#0ea5e9",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-amber-500",
    bgHex: "#f59e0b",
    textClass: "text-gray-900",
    textHex: "#111827",
  },
  {
    bgClass: "bg-slate-500",
    bgHex: "#64748b",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-gray-500",
    bgHex: "#6b7280",
    textClass: "text-white",
    textHex: "#ffffff",
  },
  {
    bgClass: "bg-zinc-500",
    bgHex: "#71717a",
    textClass: "text-white",
    textHex: "#ffffff",
  },
];

/**
 * Generate consistent avatar color based on a string (name/id)
 * This ensures the same input always gets the same color
 */
export function getAvatarColor(input: string) {
  if (!input) {
    return avatarColors[0]; // Default color
  }

  // Create a simple hash from the input string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use absolute value and modulo to get array index
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

/**
 * Get initials from a name (returns single character)
 */
export function getInitials(name: string): string {
  if (!name) return "?";

  // Get first character of the first word only
  return name.trim().charAt(0).toUpperCase();
}

/**
 * Generate avatar props with consistent colors and initials
 */
export function getAvatarProps(name: string, id?: string) {
  const initials = getInitials(name);
  const colorKey = id || name; // Use ID if available, otherwise use name
  const colors = getAvatarColor(colorKey);

  return {
    initials,
    bgHex: colors.bgHex,
    textHex: colors.textHex,
    bgClass: colors.bgClass,
    textClass: colors.textClass,
    className: `${colors.bgClass} ${colors.textClass}`,
  };
}
