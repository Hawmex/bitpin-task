import { useCallback, useEffect, useMemo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Markets } from "~/components/markets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { groupMarkets } from "~/lib/utils";
import { useGetMarkets } from "~/services/markets";

export default function () {
  const { data: markets, isFetched, isLoading } = useGetMarkets();
  const groupedMarkets = useMemo(() => groupMarkets(markets ?? []), [markets]);
  const [paginations, setPaginations] = useState<Record<string, number>>({});
  const [currentTab, setCurrentTab] = useState<string>("");

  const tabCodes = useMemo(
    () => groupedMarkets.map(({ marketsBase }) => marketsBase.code),
    [groupedMarkets],
  );

  const currentIndex = useMemo(
    () => tabCodes.indexOf(currentTab),
    [currentTab, tabCodes],
  );

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (currentIndex < tabCodes.length - 1) {
        setCurrentTab(tabCodes[currentIndex + 1]);
      }
    },
    onSwipedLeft: () => {
      if (currentIndex > 0) {
        setCurrentTab(tabCodes[currentIndex - 1]);
      }
    },
    trackMouse: true,
  });

  const handlePageChange = useCallback(
    (code: string) => (currentPage: number) =>
      setPaginations((paginations) => ({
        ...paginations,
        [code]: currentPage,
      })),
    [],
  );

  useEffect(() => {
    if (currentTab === "" && isFetched) {
      setCurrentTab(groupedMarkets![0].marketsBase.code);
    }
  }, [currentTab, groupedMarkets, isFetched]);

  return isLoading ? (
    <div className="flex h-screen w-screen items-center justify-center">
      لطفا شکیبا باشید...
    </div>
  ) : (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      className="w-full p-2 m-auto"
    >
      <TabsList className="w-full flex flex-row">
        {groupedMarkets.map(({ marketsBase: { code, image, title_fa } }) => (
          <TabsTrigger className="grow-1" key={code} value={code}>
            <img className="w-6 h-6" src={image} />
            <span>
              {title_fa} ({code})
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {groupedMarkets.map(({ marketsBase: { code }, markets }) => (
        <TabsContent key={code} value={code} {...swipeHandlers}>
          <Markets
            markets={markets}
            currentPage={paginations[code] ?? 1}
            onPageChange={handlePageChange(code)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
