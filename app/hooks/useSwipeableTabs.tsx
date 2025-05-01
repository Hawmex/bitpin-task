import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useSwipeable, type SwipeableHandlers } from "react-swipeable";

export type UseSwipeableTabsProps = {
  values: string[];
};

export type UseSwipeableTabsReturn = {
  tabsValue: string;
  setTabsValue: Dispatch<SetStateAction<string>>;
  tabSwipeHandlers: SwipeableHandlers;
};

export function useSwipeableTabs({
  values,
}: UseSwipeableTabsProps): UseSwipeableTabsReturn {
  const [tabsValue, setTabsValue] = useState(values[0] ?? "");

  const currentIndex = useMemo(
    () => values.indexOf(tabsValue),
    [tabsValue, values],
  );

  const tabSwipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (currentIndex < values.length - 1) {
        setTabsValue(values[currentIndex + 1]);
      }
    },
    onSwipedLeft: () => {
      if (currentIndex > 0) {
        setTabsValue(values[currentIndex - 1]);
      }
    },
    trackMouse: true,
  });

  return { tabsValue, setTabsValue, tabSwipeHandlers };
}
