"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer
      className={cn(
        "bg-sidebar flex items-center border-t text-center text-xs text-muted-foreground sm:h-16 sm:text-sm",
      )}
    >
      <div className="flex w-full flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:gap-3 sm:px-6">
        <span className="text-xs text-muted-foreground sm:text-sm">
          {t("layouts.footer.copyright")}
        </span>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("layouts.footer.terms")}
          </Button>

          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("layouts.footer.policy")}
          </Button>

          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("layouts.footer.help")}
          </Button>
        </div>
      </div>
    </footer>
  );
}
