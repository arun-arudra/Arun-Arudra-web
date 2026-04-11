import { useEffect, useRef } from "react";

export function MorphingBlob() {
  const blobRef = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    const blob2 = blob2Ref.current;
    if (!blob || !blob2) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      blob.style.transform = `translate(${x}px, ${y}px)`;
      blob2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary blob */}
      <div
        ref={blobRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-30 dark:opacity-20 transition-transform duration-700 ease-out"
      >
        <div className="w-full h-full animate-blob-morph bg-gradient-to-br from-primary via-orange-400 to-red-500 blur-3xl" />
      </div>
      {/* Secondary blob */}
      <div
        ref={blob2Ref}
        className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-15 dark:opacity-10 transition-transform duration-1000 ease-out"
      >
        <div className="w-full h-full animate-blob-morph-reverse bg-gradient-to-tl from-primary/60 via-orange-300 to-amber-400 blur-3xl" />
      </div>
    </div>
  );
}
