import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { Logo } from "../Logo";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "About", path: "/about" },
  { label: "News", path: "/news" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change so it never stays open after navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${scrolled ? "bg-background/95 border-border h-14" : "bg-background/80 border-border/50 h-16"}`}>
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        <Link to="/" aria-label="ArunArudra — Home" className="flex items-center shrink-0 min-w-0">
          <Logo className="h-6 sm:h-8 w-auto [&_svg]:h-6 sm:[&_svg]:h-8 [&_svg]:w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium relative py-1 transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
          <ThemeToggle />
          <Button size="sm" className="rounded-full px-5" asChild>
            <Link to="/contact">Book a Call</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden shrink-0">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-11 w-11 -mr-2 shrink-0"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden max-h-[calc(100dvh-56px)] overflow-y-auto"
          >
            <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium py-3 transition-colors hover:text-primary border-b border-border/40 last:border-b-0 ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button size="sm" className="rounded-full w-full mt-3" asChild>
                <Link to="/contact" onClick={() => setIsOpen(false)}>Book a Call</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
