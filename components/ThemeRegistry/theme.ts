"use client";

import { createTheme } from "@mui/material/styles";
import { COLORS } from "@/utils/enum";

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
            main: COLORS.BLACK,
        },
        secondary: {
            main: COLORS.WHITE,
        },
        background: {
            default: COLORS.BACKGROUND,
            paper: COLORS.CARD,
        },
        text: {
            primary: COLORS.FOREGROUND,
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
                        backgroundColor: COLORS.BLACK,
                        color: COLORS.WHITE,
                        "&:hover": {
                            backgroundColor: COLORS.ACCENT,
                        },
                        "& .MuiListItemIcon-root": {
                            color: COLORS.WHITE,
                        },
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: COLORS.BLACK,
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
        background: COLORS.BACKGROUND,
        foreground: COLORS.FOREGROUND,
        primary: COLORS.BLACK,
        secondary: COLORS.WHITE,
        accent: COLORS.ACCENT,
        muted: COLORS.ACCENT,
        border: COLORS.ACCENT,
    },
});

export default theme;
