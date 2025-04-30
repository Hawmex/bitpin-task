import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useThemeMode } from "~/hooks";

export default function () {
  const { themeModeValue, setThemeModeName } = useThemeMode();

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(themeModeValue);
  }, [themeModeValue]);

  return (
    <ScrollArea className="h-screen">
      <div className="grid grid-cols-[1fr_max-content_1fr] w-full p-2 items-center sticky top-0 z-10 bg-background border-b-1 gap-2">
        <div className="flex gap-2 justify-start"></div>
        <span className="font-bold text-center select-none">بیت‌پین</span>
        <div className="flex gap-2 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">تغییر حالت</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setThemeModeName("dark")}>
                تاریک
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemeModeName("light")}>
                روشن
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Outlet />
    </ScrollArea>
  );
}
