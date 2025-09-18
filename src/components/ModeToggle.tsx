"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const startTransition = useCallback((updateFn: () => void) => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (
        document as Document & { startViewTransition: (fn: () => void) => void }
      ).startViewTransition(updateFn);
    } else {
      updateFn();
    }
  }, []);

  // Inject a quick circle reveal animation (top-right) before theme swap
  const runCircleTransition = () => {
    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `@supports (view-transition-name: root) {\n  ::view-transition-old(root){animation:none;}\n  ::view-transition-new(root){animation:circle-expand 0.4s ease-out; transform-origin: top right;}\n  @keyframes circle-expand {\n    from { clip-path: circle(0% at 100% 0%); }\n    to { clip-path: circle(150% at 100% 0%); }\n  }\n}`;
    document.head.appendChild(style);
    setTimeout(() => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    }, 2000);
  };

  const onPickTheme = (next: "light" | "dark" | "system") => {
    runCircleTransition();
    startTransition(() => setTheme(next));
  };
  const applyTheme = (next: "light" | "dark" | "system") => {
    const root = document.documentElement;
    root.classList.add("theme-changing");
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-changing"), 350);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => onPickTheme("light")}
          disabled={theme === "light"}
        >
          <Sun className="h-4 w-4 text-muted-foreground" />
          <span>Light</span>
          {theme === "light" && (
            <Check className="ml-auto h-4 w-4 text-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onPickTheme("dark")}
          disabled={theme === "dark"}
        >
          <Moon className="h-4 w-4 text-muted-foreground" />
          <span>Dark</span>
          {theme === "dark" && (
            <Check className="ml-auto h-4 w-4 text-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onPickTheme("system")}
          disabled={theme === "system"}
        >
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <span>System</span>
          {theme === "system" && (
            <Check className="ml-auto h-4 w-4 text-foreground" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------
// Extra: Animated Theme Toggle Button (as requested)
// ---------------------------------------------
type AnimationVariant = "circle" | "circle-blur" | "gif" | "polygon";
type StartPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface ThemeToggleButtonProps {
  theme?: "light" | "dark";
  showLabel?: boolean;
  variant?: AnimationVariant;
  start?: StartPosition;
  url?: string; // For gif variant
  className?: string;
  onClick?: () => void;
}

export const ThemeToggleButton = ({
  theme = "light",
  showLabel = false,
  variant = "circle",
  start = "center",
  url,
  className,
  onClick,
}: ThemeToggleButtonProps) => {
  const handleClick = useCallback(() => {
    // Inject animation styles for this specific transition
    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement("style");
    style.id = styleId;

    // Generate animation CSS based on variant
    let css = "";
    const positions: Record<StartPosition, string> = {
      center: "center",
      "top-left": "top left",
      "top-right": "top right",
      "bottom-left": "bottom left",
      "bottom-right": "bottom right",
    };

    if (variant === "circle") {
      const cx =
        start === "center" ? "50" : start.includes("left") ? "0" : "100";
      const cy =
        start === "center" ? "50" : start.includes("top") ? "0" : "100";
      css = `@supports (view-transition-name: root) {\n  ::view-transition-old(root){animation:none;}\n  ::view-transition-new(root){animation:circle-expand 0.4s ease-out; transform-origin:${positions[start]};}\n  @keyframes circle-expand {\n    from { clip-path: circle(0% at ${cx}% ${cy}%); }\n    to { clip-path: circle(150% at ${cx}% ${cy}%); }\n  }\n}`;
    } else if (variant === "circle-blur") {
      const cx =
        start === "center" ? "50" : start.includes("left") ? "0" : "100";
      const cy =
        start === "center" ? "50" : start.includes("top") ? "0" : "100";
      css = `@supports (view-transition-name: root) {\n  ::view-transition-old(root){animation:none;}\n  ::view-transition-new(root){animation:circle-blur-expand 0.5s ease-out; transform-origin:${positions[start]}; filter:blur(0);}\n  @keyframes circle-blur-expand {\n    from { clip-path: circle(0% at ${cx}% ${cy}%); filter:blur(4px);}\n    to { clip-path: circle(150% at ${cx}% ${cy}%); filter:blur(0);}\n  }\n}`;
    } else if (variant === "gif" && url) {
      css = `@supports (view-transition-name: root) {\n  ::view-transition-old(root){animation:fade-out 0.4s ease-out;}\n  ::view-transition-new(root){animation:gif-reveal 2.5s cubic-bezier(0.4,0,0.2,1); mask-image:url('${url}'); mask-size:0%; mask-repeat:no-repeat; mask-position:center;}\n  @keyframes fade-out { to { opacity:0; } }\n  @keyframes gif-reveal { 0% { mask-size:0%; } 20% { mask-size:35%; } 60% { mask-size:35%; } 100% { mask-size:300%; } }\n}`;
    } else if (variant === "polygon") {
      css = `@supports (view-transition-name: root) {\n  ::view-transition-old(root){animation:none;}\n  ::view-transition-new(root){animation:${theme === "light" ? "wipe-in-dark" : "wipe-in-light"} 0.4s ease-out;}\n  @keyframes wipe-in-dark { from { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);} to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);} }\n  @keyframes wipe-in-light { from { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);} to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);} }\n}`;
    }

    if (css) {
      style.textContent = css;
      document.head.appendChild(style);
      setTimeout(() => {
        const styleEl = document.getElementById(styleId);
        if (styleEl) styleEl.remove();
      }, 3000);
    }

    // Call the onClick handler if provided
    onClick?.();
  }, [onClick, variant, start, url, theme]);

  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden transition-all",
        showLabel && "gap-2",
        className,
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {showLabel && (
        <span className="text-sm">{theme === "light" ? "Light" : "Dark"}</span>
      )}
    </Button>
  );
};

// Helper hook to wrap updates in View Transitions
export const useThemeTransition = () => {
  const startTransition = useCallback((updateFn: () => void) => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (
        document as Document & { startViewTransition: (fn: () => void) => void }
      ).startViewTransition(updateFn);
    } else {
      updateFn();
    }
  }, []);
  return { startTransition };
};
