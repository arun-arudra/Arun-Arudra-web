import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "../ScrollToTop";
import { PageTransition } from "../PageTransition";
import { CustomCursor } from "../CustomCursor";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Navbar />
      <main className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
