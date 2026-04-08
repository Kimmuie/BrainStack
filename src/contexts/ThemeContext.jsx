import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchAPI } from "../service/fetchapi"

const themes = {
  light: { 
    Primary: "#D2AB61",
    DarkerPrimary: "#c09957",
    Secondary: "#FAF8F1",
    DarkerSecondary: "#E1DFD8",
    Tertiary: "#313647",
    DarkerTertiary: "#2c303f",
    customred: "#DC0E0E",
  },
  dark: { 
    Primary: "#D2AB61",
    DarkerPrimary: "#c09957",
    Secondary: "#313647",
    DarkerSecondary: "#2c303f",
    Tertiary: "#FAF8F1",
    DarkerTertiary: "#E1DFD8",
    customred: "#DC0E0E",
  },
};

const themeIcons = {
  light: {
    test: "./img/Home-light.svg",
  },
  dark: {
    test: "./img/Home-dark.svg",
  },
};

// Create context
const ThemeContext = createContext();

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [email, setEmail] = useState(() => localStorage.getItem('email'))
  const [theme, setTheme] = useState("dark");
  const [icons, setIcons] = useState(themeIcons.dark);

  // โหลดข้อมูลผู้ใช้เข้า เวลาล็อคอิน, กดเซฟไรงี้
  useEffect(() => {
      if (!email) return;
      const loadUser = async () => {
          const data = await fetchAPI(`/users/${email}`, "GET");
          if (data) {
              const newTheme = data.theme || 'dark';
              setTheme(newTheme);
              applyTheme(newTheme);
          }
      };
      loadUser();
  }, [email]);

const applyTheme = (themeName) => {
  const selectedTheme = themes[themeName] || themes.light;
  Object.entries(selectedTheme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
};

  // Function to change theme that can be called from anywhere in the app
  const changeTheme = useCallback((newTheme) => {
      if (themes[newTheme]) {
          setTheme(newTheme);
          setIcons(themeIcons[newTheme] || themeIcons.dark);
          applyTheme(newTheme);
      }
  }, []);

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    applyTheme(theme);
    setIcons(themeIcons[theme]);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      icons, 
      changeTheme,
      themes,
      themeIcons
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;