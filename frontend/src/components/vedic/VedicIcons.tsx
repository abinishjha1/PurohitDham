import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// ॐ Sacred Om Icon
export function OmIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Om"
      {...props}
    >
      <path d="M48.2 24.3c-2.8-4.5-7.4-7.5-12.8-7.5-8.8 0-16 7.2-16 16 0 5.4 2.7 10.2 6.8 13.1-4.8 3.1-8 8.5-8 14.7 0 9.8 8 17.8 17.8 17.8 8.2 0 15.1-5.6 17.1-13.2 2.6 7.4 9.6 12.8 17.9 12.8 10.5 0 19-8.5 19-19 0-8.2-5.2-15.2-12.6-17.8 4.2-2.8 7-7.6 7-13.1 0-8.8-7.2-16-16-16-5.8 0-10.9 3.1-13.7 7.7-2.6-4.6-7.5-7.7-13.1-7.7-3.2 0-6.1 1-8.5 2.8 2.5 2.1 4.5 4.9 5.8 8.1 1.9-1.2 4.1-1.9 6.5-1.9 6.6 0 12 5.4 12 12 0 5.9-4.3 10.8-10 11.8v3.2c5.7 1 10 5.9 10 11.8 0 6.6-5.4 12-12 12-6.2 0-11.3-4.7-11.9-10.8h-4.2c.6 8.5 7.6 15.2 16.1 15.2 7.7 0 14.2-5.4 15.7-12.6 2.3 5.4 7.6 9.2 13.9 9.2 8.3 0 15-6.7 15-15 0-6.7-4.4-12.4-10.5-14.3v-3.2c6.1-1.9 10.5-7.6 10.5-14.3 0-8.3-6.7-15-15-15-5.9 0-11 3.4-13.5 8.4-1.2-2.5-3-4.6-5.2-6.2z" />
      <path d="M72 13.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5zm0 11c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
      <path d="M60 27.5c2.8 3.5 7.1 5.8 12 5.8s9.2-2.3 12-5.8c-2.3-1.6-5.5-2.5-9-2.5s-6.7.9-9 2.5z" />
    </svg>
  );
}

// 卐 Auspicious Swastika Icon
export function SwastikaIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Swastika"
      {...props}
    >
      <path d="M46 8v38H8V34h26V8h12zm0 84V54H8v12h26v26h12zm8-84v38h38V34H66V8H54zm0 84V54h38v12H66v26H54z" />
      {/* 4 sacred bindus (dots) */}
      <circle cx="28" cy="28" r="3.5" />
      <circle cx="72" cy="28" r="3.5" />
      <circle cx="28" cy="72" r="3.5" />
      <circle cx="72" cy="72" r="3.5" />
    </svg>
  );
}

// Kalash Icon (मंगल कलश)
export function KalashIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Kalash"
      {...props}
    >
      {/* Coconut on top */}
      <path d="M50 10c-5 0-10 6-10 14 0 3 1 6 3 8h14c2-2 3-5 3-8 0-8-5-14-10-14z" />
      {/* Mango leaves (आम्रपल्लव) */}
      <path d="M36 28c-8-4-16-2-20 4 6 2 13 0 18-3l2-1zm28 0c8-4 16-2 20 4-6 2-13 0-18-3l-2-1z" />
      <path d="M40 24c-6-7-14-9-19-6 4 4 10 5 16 4l3 2zm20 0c6-7 14-9 19-6-4 4-10 5-16 4l-3 2z" />
      {/* Pot neck */}
      <path d="M34 34h32v6H34z" />
      {/* Pot rim */}
      <ellipse cx="50" cy="40" rx="19" ry="3.5" />
      {/* Pot body with Swastika engraving */}
      <path d="M31 43c-10 10-10 28 0 38 4 4 11 7 19 7s15-3 19-7c10-10 10-28 0-38H31z" />
      {/* Base */}
      <ellipse cx="50" cy="88" rx="14" ry="3" />
    </svg>
  );
}

// Diya / Deepam Icon (दीपक)
export function DiyaIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Diya"
      {...props}
    >
      {/* Flame */}
      <path
        d="M50 12c-4 10-11 18-11 26 0 7 5 12 11 12s11-5 11-12c0-8-7-16-11-26z"
        className="text-amber-500 fill-current animate-diya"
      />
      {/* Inner flame */}
      <path
        d="M50 26c-2 5-5 9-5 13 0 3 2 6 5 6s5-3 5-6c0-4-3-8-5-13z"
        className="text-yellow-300 fill-current"
      />
      {/* Diya Clay Pot */}
      <path d="M18 58c2 14 14 26 32 26s30-12 32-26H18z" />
      <ellipse cx="50" cy="58" rx="32" ry="6" />
      {/* Stand Base */}
      <path d="M42 84h16v6H42z" />
      <ellipse cx="50" cy="90" rx="14" ry="2.5" />
    </svg>
  );
}

// Trishul & Damru Icon (त्रिशूल)
export function TrishulIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Trishul"
      {...props}
    >
      {/* Central spear */}
      <path d="M50 8l-5 14h3v52h4V22h3L50 8z" />
      {/* Left prong */}
      <path d="M48 38c-12-2-20-12-22-22l-4 6c2 14 12 24 26 26v-10z" />
      {/* Right prong */}
      <path d="M52 38c12-2 20-12 22-22l4 6c-2 14-12 24-26 26v-10z" />
      {/* Damru */}
      <path d="M42 56l16 8v-8l-16 8v-8z" />
      <circle cx="50" cy="60" r="2" />
      {/* Bottom base */}
      <path d="M47 74h6v18h-6z" />
      <circle cx="50" cy="94" r="3" />
    </svg>
  );
}

// Sacred Lotus Icon (कमल पुष्प)
export function LotusIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Lotus"
      {...props}
    >
      {/* Center petal */}
      <path d="M50 20c-7 14-10 26-10 38 0 10 4 18 10 22 6-4 10-12 10-22 0-12-3-24-10-38z" />
      {/* Inner left */}
      <path d="M46 32c-12 10-18 22-18 33 0 8 4 14 10 17 2-12 5-24 8-50z" />
      {/* Inner right */}
      <path d="M54 32c12 10 18 22 18 33 0 8-4 14-10 17-2-12-5-24-8-50z" />
      {/* Outer left */}
      <path d="M38 48c-14 8-22 18-22 28 0 6 5 10 12 11 3-10 7-21 10-39z" />
      {/* Outer right */}
      <path d="M62 48c14 8 22 18 22 28 0 6-5 10-12 11-3-10-7-21-10-39z" />
      {/* Base pad */}
      <path d="M26 88c14 4 34 4 48 0-4-3-12-5-24-5s-20 2-24 5z" />
    </svg>
  );
}

// Sacred Vedic Mandala Yantra Background Pattern (SVG)
export function VedicMandala({ className = "w-full h-full", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <circle cx="200" cy="200" r="190" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      <circle cx="200" cy="200" r="170" strokeWidth="1.5" opacity="0.4" />
      <circle cx="200" cy="200" r="140" strokeWidth="1" opacity="0.3" />
      <circle cx="200" cy="200" r="100" strokeWidth="2" opacity="0.5" />
      <circle cx="200" cy="200" r="60" strokeWidth="1.5" opacity="0.4" />
      <circle cx="200" cy="200" r="20" strokeWidth="2" opacity="0.6" />

      {/* 8-Petal Star Polygon (अष्टकोणीय यन्त्र) */}
      <polygon
        points="200,30 238,140 350,140 260,205 295,315 200,250 105,315 140,205 50,140 162,140"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <polygon
        points="200,60 230,150 320,150 248,203 275,290 200,240 125,290 152,203 80,150 170,150"
        strokeWidth="1.2"
        opacity="0.3"
      />

      {/* Inner sacred petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M200 100 C215 130 215 160 200 180 C185 160 185 130 200 100 Z"
            strokeWidth="1"
            opacity="0.4"
          />
          <circle cx="200" cy="85" r="4" fill="currentColor" opacity="0.5" />
          <line x1="200" y1="20" x2="200" y2="45" strokeWidth="1.5" opacity="0.4" />
        </g>
      ))}

      {/* Center Bindu */}
      <circle cx="200" cy="200" r="6" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
