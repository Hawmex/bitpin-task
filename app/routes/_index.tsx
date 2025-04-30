import { useMemo } from "react";
import { Currencies } from "~/components/currencies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { groupMarkets } from "~/lib/utils";
import { useGetMarkets } from "~/services/markets";

export default function () {
  const { data: markets } = useGetMarkets();

  const groupedMarkets = useMemo(() => groupMarkets(markets ?? []), [markets]);

  return (
    <Tabs defaultValue="account" className="w-full p-2 m-auto">
      <TabsList className="w-full flex flex-row">
        {Object.entries(groupedMarkets).map(
          ([
            primaryCode,
            {
              primaryCurrency: { title_fa, image },
            },
          ]) => (
            <TabsTrigger
              className="grow-1"
              key={primaryCode}
              value={primaryCode}
            >
              <img className="w-4 h-4" src={image} /> {title_fa} ({primaryCode})
            </TabsTrigger>
          ),
        )}
      </TabsList>
      {Object.entries(groupedMarkets).map(
        ([primaryCode, { secondaryCurrencies }]) => (
          <TabsContent key={primaryCode} value={primaryCode}>
            <Currencies currencies={secondaryCurrencies} />
          </TabsContent>
        ),
      )}
    </Tabs>
  );
}
