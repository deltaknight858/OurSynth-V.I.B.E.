import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <motion.div whileTap={{ scale: 0.95 }}>
        <Switch
          id="theme-toggle"
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          aria-label="Toggle theme"
        />
      </motion.div>
      <Moon className="h-4 w-4" />
    </div>
  );
}
