import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchAPI } from "../service/fetchapi"

const themes = {
  light: { 
    Primary: "#D2AB61",
    "Darker-Primary": "#c09957",
    Secondary: "#f6f5f3",
    "Darker-Secondary": "#edebe7",
    Tertiary: "#313647",
    "DarkerTertiary": "#2c303f",
    customred: "#DC0E0E",
  },
  dark: { 
    Primary: "#D2AB61",
    "Darker-Primary": "#c09957",
    Secondary: "#313647",
    "Darker-Secondary": "#2c303f",
    Tertiary: "#f6f5f3",
    "Darker-Tertiary": "#edebe7",
    customred: "#DC0E0E",
  },
};

const themeIcons = {
  light: {
    user: "/img/icon_user_light.svg",
    edit: "/img/icon_edit_light.svg",
    theme: "/img/icon_sun_light.svg",
    check: "/img/icon_check_light.svg",
    filterOff: "/img/icon_filter_off_light.svg",
    filterOn: "/img/icon_filter_on_light.svg",
    add: "/img/icon_add_light.svg",
    vote: "/img/icon_vote_light.svg",
    list: "/img/icon_list_light.svg",
    mindmap: "/img/icon_mindmap_light.svg",
    comment: "/img/icon_comment_light.svg",
    upvote: "/img/icon_upvote_light.svg",
    downvote: "/img/icon_downvote_light.svg",
  },
  dark: {
    user: "/img/icon_user_dark.svg",
    edit: "/img/icon_edit_dark.svg",
    theme: "/img/icon_moon_dark.svg",
    check: "/img/icon_check_dark.svg",
    filterOff: "/img/icon_filter_off_dark.svg",
    filterOn: "/img/icon_filter_on_dark.svg",
    add: "/img/icon_add_dark.svg",
    vote: "/img/icon_vote_dark.svg",
    list: "/img/icon_list_dark.svg",
    mindmap: "/img/icon_mindmap_dark.svg",
    comment: "/img/icon_comment_dark.svg",
    upvote: "/img/icon_upvote_dark.svg",
    downvote: "/img/icon_downvote_dark.svg",
  },
};

const ThemeContext = createContext();

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