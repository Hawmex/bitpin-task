import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { formatCurrency } from "~/lib/utils";
import { useGetOrders, type BPMarket, type BPOrder } from "~/services";
import { Loading } from "./loading";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type OrdersProps = { orders: BPOrder[]; market: BPMarket; isLoading?: boolean };

function Orders({
  orders,
  market: { currency1, currency2 },
  isLoading,
}: OrdersProps) {
  const slicedOrders = useMemo(() => orders.slice(0, 10), [orders]);

  const total = useCallback(
    (field: keyof BPOrder) =>
      slicedOrders.reduce((prev, curr) => prev + Number(curr[field]), 0),
    [slicedOrders],
  );

  const product = useCallback(
    (field1: keyof BPOrder, field2: keyof BPOrder) =>
      slicedOrders.reduce(
        (prev, curr) => prev + Number(curr[field1]) * Number(curr[field2]),
        0,
      ),
    [slicedOrders],
  );

  const [share, setShare] = useState("");
  const shareNum = useMemo(() => Number(share) / 100, [share]);

  const handleChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      if (value === "") {
        setShare("");

        return;
      }

      const num = Number(value);

      if (!isNaN(num) && num >= 0 && num <= 100) setShare(value);
    },
    [],
  );

  const totAmount = useMemo(() => total("amount"), [total]);

  const avgPrice = useMemo(
    () => product("amount", "price") / total("amount"),
    [product, total],
  );

  const totValue = useMemo(() => total("value"), [total]);
  const totRemain = useMemo(() => total("remain"), [total]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-x-4 gap-y-2 items-center flex-wrap">
        <div className="relative w-40">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="درصد"
            value={share}
            onChange={handleChange}
            className=" pr-8"
            dir="ltr"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            %
          </span>
        </div>
        {!!shareNum && (
          <div className="flex flex-row flex-wrap gap-4">
            <span>
              مقدار: {formatCurrency(totRemain * shareNum, currency1)}
            </span>
            <span>قیمت: {formatCurrency(avgPrice, currency2)}</span>
            <span>ارزش: {formatCurrency(totValue * shareNum, currency2)}</span>
          </div>
        )}
      </div>
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
              <TableCell>{formatCurrency(amount, currency1)}</TableCell>
              <TableCell>{formatCurrency(price, currency2)}</TableCell>
              <TableCell>{formatCurrency(value, currency2)}</TableCell>
              <TableCell>{formatCurrency(remain, currency1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-muted/50">
          <TableRow>
            <TableCell>{formatCurrency(totAmount, currency1)}</TableCell>
            <TableCell>{formatCurrency(avgPrice, currency2)}</TableCell>
            <TableCell>{formatCurrency(totValue, currency2)}</TableCell>
            <TableCell>{formatCurrency(totRemain, currency1)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export type BuyOrdersProps = { market: BPMarket };

export function BuyOrders({ market }: BuyOrdersProps) {
  const { data: orders, isLoading } = useGetOrders({
    marketId: market.id,
    orderType: "buy",
  });

  return <Orders orders={orders ?? []} market={market} isLoading={isLoading} />;
}

export type SellOrdersProps = { market: BPMarket };

export function SellOrders({ market }: SellOrdersProps) {
  const { data: orders, isLoading } = useGetOrders({
    marketId: market.id,
    orderType: "sell",
  });

  return <Orders orders={orders ?? []} market={market} isLoading={isLoading} />;
}
