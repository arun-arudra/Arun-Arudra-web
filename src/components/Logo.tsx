import logoRaw from "@/assets/logo.svg?raw";

// Replace text fills (dark grey + navy) with currentColor so the wordmark
// adapts to light/dark themes. The colorful glyph keeps its brand colors.
const themed = logoRaw
  .replace(/#1A1A1A/gi, "currentColor")
  .replace(/#343C6B/gi, "currentColor");

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={"inline-block text-foreground " + (className ?? "")}
      aria-label="ArunArudra"
      dangerouslySetInnerHTML={{ __html: themed }}
    />
  );
}
