"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" aria-hidden="true" />;
  }

  const isLight = resolvedTheme === "light";

  return (
    <Button
      isIconOnly
      variant="outline"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      onPress={() => setTheme(isLight ? "dark" : "light")}
      className="relative overflow-hidden"
    >
      <span className="relative block w-5.5 h-5.5">
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
            isLight ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
          }`}
        >
          <SunFilledIcon size={22} />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
            !isLight ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          }`}
        >
          <MoonFilledIcon size={22} />
        </span>
      </span>
    </Button>
  );
}