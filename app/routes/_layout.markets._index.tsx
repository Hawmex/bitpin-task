import { useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from "~/components/loading";
import { Markets } from "~/components/markets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSwipeableTabs } from "~/hooks";
import { groupMarkets } from "~/lib/utils";
import { useGetMarkets } from "~/services";

export default function () {
  const { data: markets, isFetched, isLoading } = useGetMarkets();
  const groupedMarkets = useMemo(() => groupMarkets(markets ?? []), [markets]);
  const [paginations, setPaginations] = useState<Record<string, number>>({});

  const { tabsValue, setTabsValue, tabSwipeHandlers } = useSwipeableTabs({
    values: groupedMarkets.map(({ marketsBase }) => marketsBase.code),
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
    if (tabsValue === "" && isFetched) {
      setTabsValue(groupedMarkets![0].marketsBase.code);
    }
  }, [tabsValue, setTabsValue, groupedMarkets, isFetched]);

  return isLoading ? (
    <Loading />
  ) : (
    <Tabs value={tabsValue} onValueChange={setTabsValue} className="w-full p-2">
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
        <TabsContent key={code} value={code} {...tabSwipeHandlers}>
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
