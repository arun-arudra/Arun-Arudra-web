import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

interface SponsorSlotProps {
  variant?: "inline" | "sidebar";
  storageKey?: string;
  /** Override the default slot id from .env for this placement */
  slotId?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Minimal, non-disruptive sponsor / ad slot.
 *
 * To enable Google AdSense, set these in your .env (then restart dev server):
 *   VITE_SPONSOR_ENABLED="true"
 *   VITE_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"   ← your AdSense Publisher ID
 *   VITE_ADSENSE_SLOT="1234567890"                  ← default ad unit slot ID
 *
 * You can override the slot per placement with the `slotId` prop
 * (e.g. a different slot for the news list vs. article body).
 *
 * If VITE_ADSENSE_CLIENT is empty, the component shows a styled placeholder
 * so you can see where ads will appear without loading AdSense.
 *
 * For Meta Audience Network or a custom network, replace the <ins> block
 * inside the `client && slot` branch with that provider's tag.
 */
export function SponsorSlot({ variant = "inline", storageKey = "sponsor-dismissed", slotId }: SponsorSlotProps) {
  const [dismissed, setDismissed] = useState(true);
  const insRef = useRef<HTMLModElement | null>(null);

  const enabled = siteConfig.sponsorEnabled;
  const client = siteConfig.adsenseClient || undefined;
  const slot = slotId ?? siteConfig.adsenseSlot ?? undefined;

  useEffect(() => {
    if (!enabled) return;
    const stored = localStorage.getItem(storageKey);
    if (stored && Date.now() - parseInt(stored) < 86400000) return;
    setDismissed(false);
  }, [storageKey, enabled]);

  // Inject AdSense script once, then push the slot for rendering.
  useEffect(() => {
    if (!enabled || dismissed || !client || !slot) return;
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not ready yet — it will pick up on next push */
    }
  }, [enabled, dismissed, client, slot]);

  const dismiss = () => {
    localStorage.setItem(storageKey, Date.now().toString());
    setDismissed(true);
  };

  if (!enabled || dismissed) return null;

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
        className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Sponsored</span>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      <div className="mt-3 min-h-[90px] flex items-center justify-center">
        {client && slot ? (
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="text-xs text-muted-foreground/70">
            Add <code className="font-mono">VITE_ADSENSE_CLIENT</code> &amp; <code className="font-mono">VITE_ADSENSE_SLOT</code> to .env to show ads
          </div>
        )}
      </div>
    </aside>
  );
}
