import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Instantly scrolls to top whenever the route path changes.
 * Prevents the "page loads then jumps/reloads" feeling on navigation.
 */
export function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
