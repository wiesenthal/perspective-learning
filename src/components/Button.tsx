"use client";

import { cn } from "@/lib/utils";

export default function Button({
  className,
  onMouseDown,
  children,
}: {
  className?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "bg-green-800 font-bold text-4xl text-white/90 rounded-full p-48 h-4 w-4 flex justify-center items-center font-serif hover:bg-green-700 scale-y-100 hover:scale-y-99 transition-all hover:shadow-black hover:shadow-inner duration-100 hover:text-white",
        className
      )}
      onMouseDown={onMouseDown}
      style={{
        transformOrigin: "bottom",
      }}
    >
      {children}
    </button>
  );
}
