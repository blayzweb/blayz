"use client";

import { DirhamSymbol } from "dirham/react";
import { clsx } from "@/lib/clsx";

type DirhamWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

/**
 * Renders a monetary string with the UAE Dirham symbol (U+20C3) injected
 * immediately before the first digit — so "from 4k" reads "from ⃃4k" and
 * "12k – 16k" reads "⃃12k – 16k". Non-numeric copy (e.g. "let's talk") is
 * rendered untouched. The symbol inherits the surrounding text color/size.
 */
export function Money({
  value,
  weight = "bold",
  symbolSize = "0.78em",
  className,
}: {
  value: string;
  weight?: DirhamWeight;
  symbolSize?: number | string;
  className?: string;
}) {
  const idx = value.search(/\d/);

  if (idx === -1) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={clsx("whitespace-nowrap", className)}>
      {value.slice(0, idx)}
      <DirhamSymbol
        size={symbolSize}
        weight={weight}
        aria-label="UAE Dirham"
        style={{
          display: "inline-block",
          verticalAlign: "-0.04em",
          marginRight: "0.14em",
        }}
      />
      {value.slice(idx)}
    </span>
  );
}
