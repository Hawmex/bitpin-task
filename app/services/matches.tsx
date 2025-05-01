import { useQuery } from "@tanstack/react-query";
import axiosClient from "~/lib/axiosClient";

export type BPMatch = {
  time: number;
  price: string;
  value: string;
  match_amount: string;
  type: "sell" | "buy";
  match_id: string;
};

export type UseGetMatchesProps = {
  marketId: number;
};

export function useGetMatches({ marketId }: UseGetMatchesProps) {
  return useQuery({
    queryKey: ["matches", marketId],
    refetchInterval: 3 * 1000,
    queryFn: async () => {
      const res = await axiosClient.get(`v1/mth/matches/${marketId}/`);

      return res.data as BPMatch[];
    },
  });
}
