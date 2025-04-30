import { QueryClientProvider } from "@tanstack/react-query";
import { Direction } from "radix-ui";
import { Outlet } from "react-router";
import queryClient from "~/lib/queryClient";

export function Providers() {
  return (
    <Direction.Provider dir="rtl">
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </Direction.Provider>
  );
}
