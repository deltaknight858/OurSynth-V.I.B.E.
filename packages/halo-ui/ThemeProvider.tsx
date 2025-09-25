import React, { createContext, useContext, useEffect, useState } from "react";
import "../halo-ui/theme.css"; // Ensure this is imported globally

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "dark",
  setTheme: () => {},
});

export const useEcoTheme = () => useContext(ThemeContext);

export const EcoThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Apply CSS color variables for light/dark
    if (theme === "light") {
      document.documentElement.style.setProperty("--eco-bg", "#f6f8fa");
      document.documentElement.style.setProperty("--eco-bg-accent", "#e3e8f9");
      document.documentElement.style.setProperty("--eco-bg-hover", "#d3dbed");
      document.documentElement.style.setProperty("--eco-fg", "#232b3a");
      document.documentElement.style.setProperty("--eco-fg-muted", "#42507b");
      document.documentElement.style.setProperty("--eco-card-bg", "#e3e8f9");
      document.documentElement.style.setProperty("--eco-border", "#d3dbed");
    } else {
      document.documentElement.style.setProperty("--eco-bg", "#181c24");
      document.documentElement.style.setProperty("--eco-bg-accent", "#232b3a");
      document.documentElement.style.setProperty("--eco-bg-hover", "#2e3650");
      document.documentElement.style.setProperty("--eco-fg", "#e3e8f9");
      document.documentElement.style.setProperty("--eco-fg-muted", "#aeb8d4");
      document.documentElement.style.setProperty("--eco-card-bg", "#232b3a");
      document.documentElement.style.setProperty("--eco-border", "#2e3650");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Example toggle button for any panel:
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useEcoTheme();
  return (
    <button
      className="halo-btn"
      style={{ position: "absolute", top: 12, right: 12 }}
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
};