import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BPCurrency, BPMarket } from "~/services";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GroupedBPMarkets = {
  marketsBase: BPCurrency;
  markets: {
    currency: BPCurrency;
    details: Omit<BPMarket, "currency1" | "currency2">;
  }[];
};

export function groupMarkets(markets: BPMarket[]): GroupedBPMarkets[] {
  const groupsMap: Record<string, GroupedBPMarkets> = {};

  for (const market of markets) {
    const { currency1: currency, currency2: marketsBase, ...details } = market;

    if (!groupsMap[marketsBase.id]) {
      groupsMap[marketsBase.id] = {
        marketsBase,
        markets: [],
      };
    }

    groupsMap[marketsBase.id].markets.push({ currency, details });
  }

  return Object.values(groupsMap);
}
