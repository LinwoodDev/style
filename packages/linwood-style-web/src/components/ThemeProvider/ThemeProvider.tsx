import React, { PropsWithChildren, useState } from "react";

export type ThemeShadeName = "lightest" | "lighter" | "light" | "main" | "dark" | "darker" | "darkest";
export type ThemeShade ={
    [key in ThemeShadeName] : string;
}

export interface LinwoodColor {
    primary: string,
    secondary: string,
    gray: ThemeShade,
    error: string,
}

export type LinwoodMode = "light" | "dark" | "system";

export interface LinwoodTheme {
    color: LinwoodColor,
    theme: LinwoodMode
}

export interface LinwoodThemeContext {
    color: LinwoodColor,
    theme: LinwoodMode,
    setTheme: (theme: LinwoodMode) => void,
    getBackground(ThemeShadeName: ThemeShadeName, dark: boolean): string,
}

const defaultBackground = "#282C34";
const defaultError = "#ff3333";

export const newShade = (hexColor : string, magnitude : number) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};

export const getShade = (shade : ThemeShade, name : ThemeShadeName, dark : boolean) : string => {
    if (dark) {
        switch (name) {
            case "lightest":
                return shade.darkest;
            case "lighter":
                return shade.darker;
            case "light":
                return shade.dark;
            case "main":
                return shade.main;
            case "dark":
                return shade.light;
            case "darker":
                return shade.lighter;
            case "darkest":
                return shade.lightest;
        }
    } else {
        return shade[name];
    }
};

export const createColor = ({primary, secondary, background, text, error} : {primary: string, secondary: string, background?: string, text?: string, error?: string}): LinwoodColor => {
    const grayMain = background || defaultBackground;
    const grayLight = newShade(grayMain, 20);
    const grayLighter = newShade(grayMain, 40);
    const grayLightest = newShade(grayMain, 60);
    const grayDark = newShade(grayMain, -20);
    const grayDarker = newShade(grayMain, -40);
    const grayDarkest = newShade(grayMain, -60);
    return {
        primary,
        secondary,
        gray: {
            lightest: grayLightest,
            lighter: grayLighter,
            light: grayLight,
            main: grayMain,
            dark: grayDark,
            darker: grayDarker,
            darkest: grayDarkest,
        },
        error: error || defaultError,
    };
}

export const DefaultColor = createColor({
    primary: "#35EF53",
    secondary: "#2196F3",
});
export const ThemeContext = React.createContext<LinwoodThemeContext>({
    color: DefaultColor,
    theme: "system",
    setTheme: () => {},
    getBackground: () => defaultBackground,
});

export interface ThemeProviderProps {
    theme?: LinwoodTheme,
}

export default function ThemeProvider({ children, theme }: PropsWithChildren<ThemeProviderProps>) {
    const color = theme?.color || DefaultColor;
    const [themeMode, setTheme] = useState(theme?.theme || "light");

    const getBackground = (shade: ThemeShadeName, dark : boolean) => getShade(color.gray, shade, dark);
    
    return (
        <ThemeContext.Provider value={{ color, theme: themeMode, setTheme, getBackground }}>
            {children}
        </ThemeContext.Provider>
    );
}
