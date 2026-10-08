import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ModeratorPage = ({ children }) => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-full transition-colors duration-300 ${
        isDark
          ? "bg-[#0F172A] text-white"
          : "bg-[#F7F8FC] text-[#172337]"
      }`}
    >
      {children}
    </div>
  );
};

export default ModeratorPage;