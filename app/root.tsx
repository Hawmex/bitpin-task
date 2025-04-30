import { QueryClientProvider } from "@tanstack/react-query";
import { Direction } from "radix-ui";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { ScrollArea } from "./components/ui/scroll-area";
import queryClient from "./lib/queryClient";

export const meta: Route.MetaFunction = () => [
  { title: "تسک بیت‌پین" },
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export const links: Route.LinksFunction = () => [
  {
    rel: "preload stylesheet",
    as: "style",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "preload stylesheet",
    as: "style",
    href: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function () {
  return (
    <Direction.Provider dir="rtl">
      <QueryClientProvider client={queryClient}>
        <ScrollArea className="h-screen">
          <Outlet />
        </ScrollArea>
      </QueryClientProvider>
    </Direction.Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
