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
    values: groupedMarkets.map(({ baseCurrency: { code } }) => code),
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
      setTabsValue(groupedMarkets![0].baseCurrency.code);
    }
  }, [tabsValue, setTabsValue, groupedMarkets, isFetched]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-2 p-2">
      <span className="text-xl font-semibold px-2 py-2.5 text-center">
        بازارها
      </span>
      <Tabs value={tabsValue} onValueChange={setTabsValue}>
        <TabsList className="w-full flex flex-row">
          {groupedMarkets.map(({ baseCurrency: { code, image, title_fa } }) => (
            <TabsTrigger className="grow-1" key={code} value={code}>
              <img className="w-6 h-6" src={image} />
              <span>
                {title_fa} ({code})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {groupedMarkets.map((group) => (
          <TabsContent
            key={group.baseCurrency.code}
            value={group.baseCurrency.code}
          >
            <div {...tabSwipeHandlers}>
              <Markets
                group={group}
                currentPage={paginations[group.baseCurrency.code] ?? 1}
                onPageChange={handlePageChange(group.baseCurrency.code)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
