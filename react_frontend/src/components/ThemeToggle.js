import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle absolute z-10"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{ top: 24, right: 24 }}
    >
      {theme === "light"
        ? <Moon size={18} style={{ marginRight: 4, marginBottom: "-2px", display: 'inline'}} /> 
        : <Sun size={18} style={{ marginRight: 4, marginBottom: "-2px", display: 'inline'}} />}
      {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
