import { useMemo } from "react";
import { useMediaQuery, usePersistentState } from "~/hooks";

export type UseThemeModeReturn = {
  themeModeName: "dark" | "light" | "system";
  themeModeValue: "dark" | "light";
  setThemeModeName: (
    themeModeName: UseThemeModeReturn["themeModeName"],
  ) => void;
};

export function useThemeMode(): UseThemeModeReturn {
  const [themeModeName, setThemeModeName] = usePersistentState<
    UseThemeModeReturn["themeModeName"]
  >({
    persistence: "local",
    key: "themeMode",
    defaultValue: "system",
  });

  const isSystemDark = useMediaQuery("(prefers-color-scheme: dark)");

  const themeModeValue = useMemo<UseThemeModeReturn["themeModeValue"]>(
    () =>
      themeModeName === "system"
        ? isSystemDark
          ? "dark"
          : "light"
        : themeModeName,
    [isSystemDark, themeModeName],
  );

  return { themeModeName, themeModeValue, setThemeModeName };
}
