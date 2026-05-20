export const THEMES = ["yellow", "red", "blue", "green"] as const;

export type ThemeId = (typeof THEMES)[number];
export type LanguageId = "en" | "de";

export function isThemeId(value: string | undefined): value is ThemeId {
  return !!value && THEMES.includes(value as ThemeId);
}

export function getLanguageAndThemeFromPath(pathname: string): {
  language: LanguageId;
  theme: ThemeId;
} {
  const segments = pathname.toLowerCase().split("/").filter(Boolean);
  const language: LanguageId = segments[0] === "de" ? "de" : "en";
  const themeSegment = language === "de" ? segments[1] : segments[0];
  const theme: ThemeId = isThemeId(themeSegment) ? themeSegment : "yellow";
  return { language, theme };
}

export function buildPathForLanguageAndTheme(
  language: LanguageId,
  theme: ThemeId
): string {
  const languagePrefix = language === "de" ? "/de" : "";
  const themeSuffix = theme === "yellow" ? "" : `/${theme}`;
  const path = `${languagePrefix}${themeSuffix}`;
  return path || "/";
}
