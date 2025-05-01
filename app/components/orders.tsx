import Decimal from "decimal.js";
import { useCallback } from "react";
import { useGetOrders, type BPOrder } from "~/services";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type OrdersProps = { orders: BPOrder[]; isLoading: boolean };

function Orders({ orders }: OrdersProps) {
  const total = useCallback(
    (field: keyof BPOrder) =>
      orders.reduce((prev, curr) => prev + Number(curr[field]), 0),
    [orders],
  );

  const product = useCallback(
    (field1: keyof BPOrder, field2: keyof BPOrder) =>
      orders.reduce(
        (prev, curr) => prev + Number(curr[field1]) * Number(curr[field2]),
        0,
      ),
    [orders],
  );

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
            <TableCell>{new Decimal(amount).toString()}</TableCell>
            <TableCell>{new Decimal(price).toString()}</TableCell>
            <TableCell>{new Decimal(value).toString()}</TableCell>
            <TableCell>{new Decimal(remain).toString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-muted/50">
        <TableRow>
          <TableCell>{new Decimal(total("amount")).toString()}</TableCell>
          <TableCell>
            {new Decimal(
              product("amount", "price") / total("amount"),
            ).toString()}
          </TableCell>
          <TableCell>{new Decimal(total("value")).toString()}</TableCell>
          <TableCell>{new Decimal(total("remain")).toString()}</TableCell>
        </TableRow>
      </TableFooter>
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
