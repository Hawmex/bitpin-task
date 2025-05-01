import { clsx, type ClassValue } from "clsx";
import Decimal from "decimal.js";
import { twMerge } from "tailwind-merge";
import type { BPCurrency, BPMarket } from "~/services";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BPMarketsGroup = {
  baseCurrency: BPCurrency;
  markets: {
    currency: BPCurrency;
    details: Omit<BPMarket, "currency1" | "currency2">;
  }[];
};

export function groupMarkets(markets: BPMarket[]): BPMarketsGroup[] {
  const groupsMap: Record<string, BPMarketsGroup> = {};

  for (const market of markets) {
    const { currency1: currency, currency2: baseCurrency, ...details } = market;

    if (!groupsMap[baseCurrency.id]) {
      groupsMap[baseCurrency.id] = {
        baseCurrency,
        markets: [],
      };
    }

    groupsMap[baseCurrency.id].markets.push({ currency, details });
  }

  return Object.values(groupsMap);
}

export function formatCurrency(value: Decimal.Value, currency: BPCurrency) {
  const parts = new Decimal(value).toFixed(currency.decimal_amount).split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}
