import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BPCurrency, BPMarket } from "~/services/markets";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GroupedBPMarkets = Record<
  string,
  {
    primaryCurrency: Omit<BPCurrency, "code">;
    secondaryCurrencies: BPCurrency[];
    marketDetails: Omit<BPMarket, "currency1" | "currency2">;
  }
>;

export function groupMarkets(markets: BPMarket[]): GroupedBPMarkets {
  return markets.reduce((groups, market) => {
    const {
      currency1: secondaryCurrency,
      currency2: { code: primaryCode, ...primaryCurrency },
      ...marketDetails
    } = market;

    if (!groups[primaryCode]) {
      groups[primaryCode] = {
        marketDetails,
        primaryCurrency,
        secondaryCurrencies: [],
      };
    }

    groups[primaryCode].secondaryCurrencies.push(secondaryCurrency);

    return groups;
  }, {} as GroupedBPMarkets);
}
