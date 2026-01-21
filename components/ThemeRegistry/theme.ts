"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      background: string;
      foreground: string;
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
      border: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      background?: string;
      foreground?: string;
      primary?: string;
      secondary?: string;
      accent?: string;
      muted?: string;
      border?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#171717",
    },
  },
  typography: {
    fontFamily: "var(--font-primary), sans-serif",
    h1: { fontFamily: "var(--font-primary), sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-primary), sans-serif", fontWeight: 600 },
    h3: { fontFamily: "var(--font-primary), sans-serif", fontWeight: 600 },
    h4: { fontFamily: "var(--font-primary), sans-serif", fontWeight: 600 },
    h5: { fontFamily: "var(--font-primary), sans-serif", fontWeight: 500 },
    h6: { fontFamily: "var(--font-primary), sans-serif", fontWeight: 500 },
    body1: { fontFamily: "var(--font-secondary), sans-serif" },
    body2: { fontFamily: "var(--font-secondary), sans-serif" },
    button: {
      fontFamily: "var(--font-primary), sans-serif",
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "var(--primary)",
            color: "var(--secondary)",
            "&:hover": {
              backgroundColor: "var(--accent)",
            },
            "& .MuiListItemIcon-root": {
              color: "var(--secondary)",
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "var(--primary)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
  custom: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    muted: "var(--muted)",
    border: "var(--border)",
  },
});

export default theme;
