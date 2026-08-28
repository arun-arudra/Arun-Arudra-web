import logoRaw from "@/assets/logo.svg?raw";

// Replace text fills (dark grey + navy) with currentColor so the wordmark
// adapts to light/dark themes. The colorful glyph keeps its brand colors.
let themed = logoRaw
  .replace(/#1A1A1A/gi, "currentColor")
  .replace(/#343C6B/gi, "currentColor");

// Strip the hardcoded width/height attributes from the <svg> tag itself.
// The raw file has width="359" height="74" baked in, which browsers can
// prioritize over CSS in some cases and breaks responsive sizing — this
// was causing horizontal overflow on mobile. Removing them lets the SVG
// scale purely from the className passed to the wrapper (h-6 / h-8 etc),
// with viewBox preserving the correct aspect ratio.
themed = themed.replace(/<svg\s+width="[^"]*"\s+height="[^"]*"/i, "<svg");

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={"inline-block text-foreground h-full w-auto [&_svg]:h-full [&_svg]:w-auto " + (className ?? "")}
      aria-label="ArunArudra"
      dangerouslySetInnerHTML={{ __html: themed }}
    />
  );
}
