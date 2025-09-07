import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  DARK_CLASS_NAME,
  DARK_THEME_VALUE,
  LIGHT_THEME_VALUE,
  THEME_LOCAL_STORAGE_KEY,
} from "../constants/theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem(THEME_LOCAL_STORAGE_KEY) === DARK_THEME_VALUE
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(DARK_CLASS_NAME);
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, DARK_THEME_VALUE);
    } else {
      document.documentElement.classList.remove(DARK_CLASS_NAME);
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, LIGHT_THEME_VALUE);
    }
  }, [darkMode]);
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
