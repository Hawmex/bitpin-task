import { useQuery } from "@tanstack/react-query";
import axiosClient from "~/lib/axiosClient";

export type BPOrder = {
  amount: string;
  remain: string;
  price: string;
  value: string;
};

export type UseGetOrdersProps = { marketId: number; orderType: "buy" | "sell" };

export function useGetOrders({ marketId, orderType }: UseGetOrdersProps) {
  return useQuery({
    queryKey: ["orders", marketId, orderType],
    refetchInterval: 3 * 1000,
    queryFn: async () => {
      const res = await axiosClient.get(`v2/mth/actives/${marketId}/`, {
        params: { type: orderType },
      });

      return res.data.orders as BPOrder[];
    },
  });
}
