import Decimal from "decimal.js";
import { useGetMatches } from "~/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type MatchesProps = { marketId: number };

export function Matches({ marketId }: MatchesProps) {
  const { data: matches = [] } = useGetMatches({ marketId });

  return (
    <Table className="select-none">
      <TableHeader>
        <TableRow>
          <TableHead className="w-xs">شناسه</TableHead>
          <TableHead className="w-2xs">مقدار</TableHead>
          <TableHead className="w-2xs">قیمت</TableHead>
          <TableHead className="w-2xs">ارزش</TableHead>
          <TableHead className="w-xs">نوع</TableHead>
          <TableHead className="w-2xs">زمان</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches
          .slice(0, 10)
          .map(({ match_id, match_amount, price, value, type, time }) => (
            <TableRow key={match_id}>
              <TableCell>{match_id}</TableCell>
              <TableCell>{new Decimal(match_amount).toString()}</TableCell>
              <TableCell>{new Decimal(price).toString()}</TableCell>
              <TableCell>{new Decimal(value).toString()}</TableCell>
              <TableCell>{type === "buy" ? "خرید" : "فروش"}</TableCell>
              <TableCell>
                {new Date(time * 1000).toLocaleTimeString("fa-IR")}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
