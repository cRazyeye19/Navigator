import { createContext, useContext } from "react";
import { ThemeContextType } from "../types/theme";

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useDarkMode = () => useContext(ThemeContext);
