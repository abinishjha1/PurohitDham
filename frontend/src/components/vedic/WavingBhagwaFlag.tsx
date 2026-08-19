import React from "react";

interface WavingBhagwaFlagProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WavingBhagwaFlag({
  className = "",
  size = "md",
}: WavingBhagwaFlagProps) {
  const dimensions = {
    sm: { width: 38, height: 28, poleHeight: 34 },
    md: { width: 52, height: 38, poleHeight: 46 },
    lg: { width: 70, height: 50, poleHeight: 62 },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center select-none ${className}`}
      title="भगवा ध्वज (Bhagwa Dhwaj - Symbol of Sanatan Dharma)"
      aria-label="Bhagwa Dhwaj"
    >
      <svg
        width={dimensions.width + 8}
        height={dimensions.poleHeight}
        viewBox="0 0 68 56"
        className="overflow-visible filter drop-shadow-sm"
      >
        <defs>
          {/* Flag Saffron Gradient */}
          <linearGradient id="bhagwaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>

          {/* Golden Pole Gradient */}
          <linearGradient id="goldPoleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="50%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          {/* Golden Finial */}
          <linearGradient id="finialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Cloth Ripple Shadow Filter */}
          <filter id="clothShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#9A3412" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Flagpole (स्वर्ण ध्वज दंड) */}
        <g id="flagpole">
          {/* Finial Spear / Kalash top */}
          <path
            d="M7 2 L4 8 L6 8 L6 54 L8 54 L8 8 L10 8 Z"
            fill="url(#goldPoleGrad)"
            stroke="#854D0E"
            strokeWidth="0.5"
          />
          <circle cx="7" cy="3" r="2.5" fill="url(#finialGrad)" stroke="#78350F" strokeWidth="0.5" />
          <circle cx="7" cy="54" r="1.5" fill="url(#finialGrad)" />
        </g>

        {/* 2. Fluttering Twin Triangular Saffron Pennants (सनातन भगवा ध्वज) */}
        <g className="animate-flag" filter="url(#clothShadow)">
          {/* Top Triangle */}
          <path
            d="M7 7 C 22 5, 42 10, 58 14 C 42 18, 22 17, 7 24 Z"
            fill="url(#bhagwaGrad)"
            stroke="#C2410C"
            strokeWidth="0.8"
          />

          {/* Bottom Triangle */}
          <path
            d="M7 23 C 22 22, 42 27, 58 31 C 42 35, 22 34, 7 42 Z"
            fill="url(#bhagwaGrad)"
            stroke="#C2410C"
            strokeWidth="0.8"
          />

          {/* Golden Border Piping on Flag Edge */}
          <path
            d="M7 7 L58 14 L7 24 L58 31 L7 42"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="0.75"
            strokeOpacity="0.85"
          />

          {/* Golden ॐ on Top Pennant */}
          <g transform="translate(18, 9) scale(0.12)" fill="#FEF08A" opacity="0.95">
            <path d="M48.2 24.3c-2.8-4.5-7.4-7.5-12.8-7.5-8.8 0-16 7.2-16 16 0 5.4 2.7 10.2 6.8 13.1-4.8 3.1-8 8.5-8 14.7 0 9.8 8 17.8 17.8 17.8 8.2 0 15.1-5.6 17.1-13.2 2.6 7.4 9.6 12.8 17.9 12.8 10.5 0 19-8.5 19-19 0-8.2-5.2-15.2-12.6-17.8 4.2-2.8 7-7.6 7-13.1 0-8.8-7.2-16-16-16-5.8 0-10.9 3.1-13.7 7.7-2.6-4.6-7.5-7.7-13.1-7.7-3.2 0-6.1 1-8.5 2.8 2.5 2.1 4.5 4.9 5.8 8.1 1.9-1.2 4.1-1.9 6.5-1.9 6.6 0 12 5.4 12 12 0 5.9-4.3 10.8-10 11.8v3.2c5.7 1 10 5.9 10 11.8 0 6.6-5.4 12-12 12-6.2 0-11.3-4.7-11.9-10.8h-4.2c.6 8.5 7.6 15.2 16.1 15.2 7.7 0 14.2-5.4 15.7-12.6 2.3 5.4 7.6 9.2 13.9 9.2 8.3 0 15-6.7 15-15 0-6.7-4.4-12.4-10.5-14.3v-3.2c6.1-1.9 10.5-7.6 10.5-14.3 0-8.3-6.7-15-15-15-5.9 0-11 3.4-13.5 8.4-1.2-2.5-3-4.6-5.2-6.2z" />
          </g>

          {/* Golden Sun Emblem (सूर्य) on Bottom Pennant */}
          <g transform="translate(20, 27) scale(0.18)" fill="#FEF08A" opacity="0.9">
            <circle cx="25" cy="25" r="9" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="25"
                y1="10"
                x2="25"
                y2="5"
                stroke="#FEF08A"
                strokeWidth="2.5"
                transform={`rotate(${angle} 25 25)`}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
