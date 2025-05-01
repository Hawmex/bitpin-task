import { useMemo } from "react";
import { formatCurrency } from "~/lib/utils";
import { useGetMatches, type BPMarket } from "~/services";
import { Loading } from "./loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type MatchesProps = { market: BPMarket };

export function Matches({
  market: { id: marketId, currency1, currency2 },
}: MatchesProps) {
  const { data: matches = [], isLoading } = useGetMatches({ marketId });
  const slicedMatches = useMemo(() => matches.slice(0, 10), [matches]);

  return isLoading ? (
    <Loading />
  ) : (
    <Table className="select-none">
      <TableHeader>
        <TableRow>
          <TableHead>شناسه</TableHead>
          <TableHead>مقدار</TableHead>
          <TableHead>قیمت</TableHead>
          <TableHead>ارزش</TableHead>
          <TableHead>نوع</TableHead>
          <TableHead>زمان</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {slicedMatches.map(
          ({ match_id, match_amount, price, value, type, time }) => (
            <TableRow key={match_id}>
              <TableCell>{match_id}</TableCell>
              <TableCell>{formatCurrency(match_amount, currency1)}</TableCell>
              <TableCell>{formatCurrency(price, currency2)}</TableCell>
              <TableCell>{formatCurrency(value, currency2)}</TableCell>
              <TableCell>{type === "buy" ? "خرید" : "فروش"}</TableCell>
              <TableCell>
                {new Date(time * 1000).toLocaleTimeString("fa-IR")}
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}
