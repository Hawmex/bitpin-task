import { numFormatter } from "~/lib/utils";
import { useGetOrders, type BPOrder } from "~/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type OrdersProps = { orders: BPOrder[]; isLoading: boolean };

function Orders({ orders }: OrdersProps) {
  return (
    <Table className="select-none">
      <TableHeader>
        <TableRow>
          <TableHead className="w-xs">مقدار</TableHead>
          <TableHead className="w-xs">قیمت</TableHead>
          <TableHead className="w-2xs">ارزش</TableHead>
          <TableHead className="w-3xs">باقی‌مانده</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.slice(0, 10).map(({ price, remain, value, amount }) => (
          <TableRow key={`${amount}_${price}_${remain}_${value}`}>
            <TableCell>{numFormatter.format(Number(amount))}</TableCell>
            <TableCell>{numFormatter.format(Number(price))}</TableCell>
            <TableCell>{numFormatter.format(Number(value))}</TableCell>
            <TableCell>{numFormatter.format(Number(remain))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export type BuyOrdersProps = { marketId: number };

export function BuyOrders({ marketId }: BuyOrdersProps) {
  const { data: orders, isLoading } = useGetOrders({
    marketId,
    orderType: "buy",
  });

  return <Orders orders={orders ?? []} isLoading={isLoading} />;
}

export type SellOrdersProps = { marketId: number };

export function SellOrders({ marketId }: SellOrdersProps) {
  const { data: orders, isLoading } = useGetOrders({
    marketId,
    orderType: "sell",
  });

  return <Orders orders={orders ?? []} isLoading={isLoading} />;
}
