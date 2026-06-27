import React from "react";

interface BrandoraLogoProps {
  className?: string;
  theme?: "light" | "dark";
  size?: number; // scale height/width
}

export const BrandoraLogo: React.FC<BrandoraLogoProps> = ({
  className = "",
  theme = "light",
  size = 180,
}) => {
  // Brand colors:
  // - Pomegranate: Vibrant Violet/Magenta gradient from #9D4EDD via #C77DFF to #7B2CBF
  // - Typography: Pure black/slate-900 in light theme, pure white in dark theme.
  const textColor = theme === "dark" ? "#FFFFFF" : "#0F172A";
  const scaleFactor = size / 240;

  return (
    <div className={`flex flex-col items-center select-none ${className}`} style={{ transform: `scale(${scaleFactor})`, transformOrigin: "center top" }}>
      <svg
        width="240"
        height="180"
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300"
      >
        <defs>
          {/* Pomegranate Gradient */}
          <linearGradient id="pomegranateGrad" x1="60" y1="30" x2="180" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D946EF" /> {/* Vibrant Magenta/Pink */}
            <stop offset="50%" stopColor="#8B5CF6" /> {/* Rich Violet */}
            <stop offset="100%" stopColor="#4C1D95" /> {/* Deep Royal Purple */}
          </linearGradient>

          {/* Glowing crescent cut */}
          <linearGradient id="crescentGrad" x1="75" y1="50" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Dark Background Glow */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Leaf Crown / Flower on top of pomegranate (5 Petals) */}
        <g id="leaf-crown" transform="translate(120, 62)">
          {/* Central Leaf */}
          <path
            d="M 0,-42 C -8,-25 -12,-10 0,0 C 12,-10 8,-25 0,-42 Z"
            fill="url(#pomegranateGrad)"
          />
          {/* Inner Left Leaf */}
          <path
            d="M -12,-35 C -22,-22 -18,-8 -3,2 C -10,-8 -6,-24 -12,-35 Z"
            fill="url(#pomegranateGrad)"
            opacity="0.95"
          />
          {/* Inner Right Leaf */}
          <path
            d="M 12,-35 C 22,-22 18,-8 3,2 C 10,-8 6,-24 12,-35 Z"
            fill="url(#pomegranateGrad)"
            opacity="0.95"
          />
          {/* Far Left Leaf */}
          <path
            d="M -26,-24 C -36,-13 -26,-2 -11,0 C -20,-6 -18,-18 -26,-24 Z"
            fill="url(#pomegranateGrad)"
            opacity="0.85"
          />
          {/* Far Right Leaf */}
          <path
            d="M 26,-24 C 36,-13 26,-2 11,0 C 20,-6 18,-18 26,-24 Z"
            fill="url(#pomegranateGrad)"
            opacity="0.85"
          />
        </g>

        {/* 2. Pomegranate Main Sphere */}
        <g id="pomegranate-body">
          {/* Main sphere */}
          <circle cx="120" cy="94" r="38" fill="url(#pomegranateGrad)" />
          
          {/* Light reflection highlight slice (sleek Crescent cut on top-left) */}
          <path
            d="M 94,68 A 33,33 0 0,1 146,80 A 30,30 0 0,0 94,68 Z"
            fill="url(#crescentGrad)"
            opacity="0.65"
          />

          {/* Organic white inner curved segment */}
          <path
            d="M 96,78 C 84,94 88,110 100,118 C 90,110 86,92 96,78 Z"
            fill="#FFFFFF"
            opacity="0.4"
          />
        </g>

        {/* 3. High-End Arabic Styled Script Calligraphy "براندورا" */}
        <g id="arabic-calligraphy" transform="translate(120, 134)" stroke={textColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Stylized custom bezier strokes for premium arabic letterforms */}
          {/* Left loop (Ba/Ra) */}
          <path
            d="M -42,3 C -40,-12 -28,-18 -22,-6 C -18,2 -26,10 -34,14 C -44,19 -48,8 -46,-1"
            fill={textColor}
          />
          {/* Center stroke curve (Noon/Dal) */}
          <path
            d="M -18,12 C -10,12 -4,-4 -4,-12 C -4,-18 -10,-12 -12,-6 C -14,1 -12,8 -6,12"
            fill={textColor}
          />
          {/* Loop for Waw */}
          <path
            d="M 4,4 C 6,-6 18,-10 18,-2 C 18,6 10,12 2,15 C -4,17 -2,12 2,8"
            fill={textColor}
          />
          {/* Right letter curve (Ra/Ya/Alif) */}
          <path
            d="M 22,-8 C 24,6 36,12 44,2 C 46,-1 40,-6 36,-2 C 32,3 26,-1 24,-12"
            fill={textColor}
          />
          {/* Crown-like punctuation accent in Arabic (Fathah / Tashkeel) */}
          <path
            d="M -8,-22 L 2,-16 M 16,-20 L 24,-15"
            stroke={textColor}
            strokeWidth="3.5"
          />
          {/* Elegant tiny diamonds/dots for noon/ya below/above */}
          <path d="M -10,-1 A 1.8,1.8 0 1,1 -10.1,-1 Z" fill={textColor} stroke="none" />
          <path d="M 12,-16 A 1.8,1.8 0 1,1 12.1,-16 Z" fill={textColor} stroke="none" />
          <path d="M 26,10 A 1.8,1.8 0 1,1 26.1,10 Z" fill={textColor} stroke="none" />
        </g>

        {/* 4. Elegant Tracking latin text "B R A N D O R A" */}
        <g id="brandora-text" transform="translate(120, 168)">
          {/* Text letters */}
          <text
            x="0"
            y="0"
            fill={textColor}
            fontFamily="'Inter', 'Space Grotesk', sans-serif"
            fontSize="13"
            fontWeight="900"
            letterSpacing="5"
            textAnchor="middle"
          >
            BRAND O RA
          </text>

          {/* Elegant tiny pomegranate instead of regular 'O' at center letter spacing */}
          <g transform="translate(14, -13) scale(0.06)">
            {/* Pomegranate Circle */}
            <circle cx="100" cy="110" r="70" fill="url(#pomegranateGrad)" />
            {/* Crown of miniature leaf */}
            <path d="M 100,40 C 90,10 80,10 100,-10 C 120,10 110,10 100,40 Z" fill="url(#pomegranateGrad)" />
            <path d="M 80,40 C 60,20 60,30 85,25" fill="url(#pomegranateGrad)" />
            <path d="M 120,40 C 140,20 140,30 115,25" fill="url(#pomegranateGrad)" />
          </g>
        </g>
      </svg>
    </div>
  );
};
