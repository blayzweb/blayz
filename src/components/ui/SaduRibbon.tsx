"use client";

import React from "react";

interface SaduRibbonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SaduRibbon({ className, style }: SaduRibbonProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        // Applies a left-pointing chevron tip:
        // Leftmost point is at 0% height 50%. Top-left corner is at 30px 0%. Bottom-left is at 30px 100%.
        clipPath: "polygon(0% 50%, 30px 0%, 100% 0%, 100% 100%, 30px 100%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Sadu repeat pattern: 60px wide by 80px high */}
          <pattern
            id="sadu-ribbon-pattern"
            width="60"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Red top and bottom stripes */}
            <rect x="0" y="0" width="60" height="10" fill="var(--blayz-orange)" />
            <rect x="0" y="70" width="60" height="10" fill="var(--blayz-orange)" />

            {/* Central black band */}
            <rect x="0" y="10" width="60" height="60" fill="#111111" />

            {/* Cream geometric diamonds and triangles */}
            {/* Left triangle */}
            <path d="M 0 40 L 12 25 L 12 55 Z" fill="var(--blayz-cream)" />
            {/* Right triangle */}
            <path d="M 60 40 L 48 25 L 48 55 Z" fill="var(--blayz-cream)" />
            
            {/* Central cream diamond */}
            <path d="M 30 15 L 48 40 L 30 65 L 12 40 Z" fill="var(--blayz-cream)" />
            
            {/* Inner red diamond */}
            <path d="M 30 28 L 38 40 L 30 52 L 22 40 Z" fill="var(--blayz-orange)" />

            {/* Subtle center detail ticks */}
            <rect x="29" y="10" width="2" height="60" fill="var(--blayz-orange)" opacity="0.35" />
          </pattern>
        </defs>
        
        {/* Fill the whole SVG viewport with our repeating Sadu pattern */}
        <rect width="100%" height="100%" fill="url(#sadu-ribbon-pattern)" />
      </svg>
    </div>
  );
}
