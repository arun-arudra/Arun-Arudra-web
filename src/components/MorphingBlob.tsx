import { useEffect, useRef } from "react";

export function MorphingBlob() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 60;
      const y = (clientY / window.innerHeight - 0.5) * 60;
      blob.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={blobRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-30 dark:opacity-20 transition-transform duration-700 ease-out"
      >
        <div className="w-full h-full animate-blob-morph bg-gradient-to-br from-primary via-orange-400 to-red-500 blur-3xl" />
      </div>
    </div>
  );
}
