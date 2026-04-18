import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SponsorSlotProps {
  variant?: "inline" | "sidebar";
  storageKey?: string;
}

/**
 * Minimal, non-disruptive sponsor / ad slot.
 * - Dismissible (remembers via localStorage for 24h)
 * - Designed to host AdSense, Meta Audience Network, or sponsored content
 * - Only renders where explicitly placed (News list + article pages)
 */
export function SponsorSlot({ variant = "inline", storageKey = "sponsor-dismissed" }: SponsorSlotProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored && Date.now() - parseInt(stored) < 86400000) return;
    setDismissed(false);
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, Date.now().toString());
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Sponsored"
      className={`relative rounded-xl border border-border/40 bg-muted/30 p-4 ${
        variant === "sidebar" ? "max-w-sm" : "w-full"
      }`}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss sponsor"
        className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Sponsored</span>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      <div className="mt-3 flex items-center gap-4">
        {/* AdSense / Meta / custom slot mounts here.
            Replace this block with your <ins class="adsbygoogle"> tag, Meta SDK widget, etc. */}
        <div
          id="ad-slot-news"
          className="flex-1 min-h-[60px] flex items-center justify-center text-xs text-muted-foreground/70"
        >
          Ad slot — drop AdSense or Meta tag here
        </div>
      </div>
    </aside>
  );
}
