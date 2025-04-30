import { useEffect, useMemo, useState } from "react";
import { usePersistentState } from "~/hooks";

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

  const [isSystemDark, setIsSystemDark] = useState(false);

  const themeModeValue = useMemo<UseThemeModeReturn["themeModeValue"]>(
    () =>
      themeModeName === "system"
        ? isSystemDark
          ? "dark"
          : "light"
        : themeModeName,
    [isSystemDark, themeModeName],
  );

  useEffect(() => {
    const queryList = matchMedia("(prefers-color-scheme: dark)");

    const listener = (event: MediaQueryListEvent) => {
      setIsSystemDark(event.matches);
    };

    queryList.addEventListener("change", listener);

    return () => queryList.removeEventListener("change", listener);
  }, []);

  return { themeModeName, themeModeValue, setThemeModeName };
}
