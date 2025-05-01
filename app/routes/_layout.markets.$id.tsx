import { useMemo, type ReactNode } from "react";
import { Loading } from "~/components/loading";
import { Matches } from "~/components/matches";
import { BuyOrders, SellOrders } from "~/components/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSwipeableTabs } from "~/hooks";
import { useGetMarkets } from "~/services";
import type { Route } from "./+types/_layout.markets.$id";

const tabs: Record<
  string,
  { title: string; Component: (props: { marketId: number }) => ReactNode }
> = {
  buyOrders: {
    title: "سفارش‌های خرید",
    Component: BuyOrders,
  },
  sellOrders: {
    title: "سفارش‌های فروش",
    Component: SellOrders,
  },
  matches: {
    title: "معاملات",
    Component: Matches,
  },
};

export default function ({ params: { id } }: Route.ComponentProps) {
  const { data: markets, isLoading } = useGetMarkets();
  const marketId = useMemo(() => Number(id), [id]);

  const market = useMemo(
    () => markets?.find(({ id }) => id === marketId),
    [marketId, markets],
  );

  const { tabsValue, setTabsValue, tabSwipeHandlers } = useSwipeableTabs({
    values: [...Object.keys(tabs)],
  });

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-2 p-2">
      <div className="mt-2 flex flex-row-reverse gap-2 items-center m-auto [&>span]:text-xl [&>span]:font-semibold">
        <img src={market?.currency1.image} className="w-8 h-8" />
        <span>{market?.currency1.code}</span>
        <span>—</span>
        <span>{market?.currency2.code}</span>
        <img src={market?.currency2.image} className="w-8 h-8" />
      </div>
      <Tabs
        value={tabsValue}
        onValueChange={setTabsValue}
        className="w-full p-2"
      >
        <TabsList className="w-full flex flex-row">
          {Object.entries(tabs).map(([key, { title }]) => (
            <TabsTrigger className="grow-1" key={key} value={key}>
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(tabs).map(([key, { Component }]) => (
          <TabsContent key={key} value={key} {...tabSwipeHandlers}>
            <Component marketId={marketId} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
