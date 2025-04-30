import { useQuery } from "@tanstack/react-query";
import axiosClient from "~/lib/axiosClient";

export type BPMarketTag = {
  id: number;
  name: string;
  name_en: string;
  has_chart: boolean;
};

export type BPCurrency = {
  id: number;
  title: string;
  title_fa: string;
  code: string;
  tradable: boolean;
  for_test: boolean;
  image: string;
  decimal: number;
  decimal_amount: number;
  decimal_irt: number;
  color: string;
  high_risk: boolean;
  show_high_risk: boolean;
  withdraw_commission: string;
  tags: BPMarketTag[];
  etf: boolean;
  for_binvest: boolean;
  for_loan: boolean;
  for_stake: boolean;
  recommend_for_deposit_weight: number;
};

export type BPPriceInfo = {
  created_at: number | null;
  price: string;
  change: number;
  min: string;
  max: string;
  time: string | null;
  mean: string | null;
  value: string | null;
  amount: string | null;
};

export type BPMarket = {
  id: number;
  currency1: BPCurrency;
  currency2: BPCurrency;
  tradable: boolean;
  otc_tradable: boolean;
  coming_soon: boolean;
  for_test: boolean;
  otc_sell_percent: string;
  otc_buy_percent: string;
  otc_max_buy_amount: string;
  otc_max_sell_amount: string;
  order_book_info: BPPriceInfo;
  internal_price_info: BPPriceInfo;
  price_info: BPPriceInfo;
  price: string;
  title: string;
  code: string;
  title_fa: string;
  trading_view_source: string;
  trading_view_symbol: string;
  otc_market: boolean;
  text: string;
  volume_24h: string;
  market_cap: string;
  circulating_supply: string;
  all_time_high: string;
  popularity_weight: number;
  freshness_weight: number;
  price_increment: string | null;
};

export function useGetMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosClient.get("v1/mkt/markets/");

      return (res.data.results as BPMarket[]).sort(
        (a, b) => Number(a.market_cap) - Number(b.market_cap),
      );
    },
  });
}
