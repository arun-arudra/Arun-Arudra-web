import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
        <p className="mb-2 text-2xl font-semibold">This page doesn't exist.</p>
        <p className="mb-8 text-muted-foreground max-w-sm mx-auto">Looks like this page took an unexpected detour. Let's get you back on track.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Back to Home
          </a>
          <a href="/contact" className="px-6 py-3 rounded-full border border-border font-medium hover:border-primary hover:text-primary transition-colors">
            Contact Arun
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
