import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const queryList = matchMedia(query);
    const listener = ({ matches }: MediaQueryListEvent) => setMatches(matches);

    queryList.addEventListener("change", listener);

    return () => queryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
