import { Moon, Sun } from "lucide-react";

export function ThemeButton({ theme, onChange, className = "theme-button" }: {
  theme: "light" | "dark";
  onChange: (theme: "light" | "dark") => void;
  className?: string;
}) {
  const next = theme === "light" ? "dark" : "light";
  return <button type="button" className={className} aria-label={`Use ${next} theme`} title={`Use ${next} theme`} onClick={() => onChange(next)}>
    {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
  </button>;
}
