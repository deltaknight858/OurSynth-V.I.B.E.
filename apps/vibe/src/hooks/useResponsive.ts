
import { useState, useEffect } from "react";

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
}

export const useResponsive = (): BreakpointState => {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    screenWidth: 0,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      
      setBreakpointState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1440,
        isLargeDesktop: width >= 1440,
        screenWidth: width,
      });
    };

    // Initial check
    updateBreakpoints();

    // Add event listener
    window.addEventListener("resize", updateBreakpoints);

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  return breakpointState;
};

// Hook for specific breakpoint checks
export const useBreakpoint = (breakpoint: "sm" | "md" | "lg" | "xl" | "2xl") => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    };

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    
    const updateMatch = () => setMatches(mediaQuery.matches);
    
    // Initial check
    updateMatch();
    
    // Add listener
    mediaQuery.addEventListener("change", updateMatch);
    
    // Cleanup
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [breakpoint]);

  return matches;
};
