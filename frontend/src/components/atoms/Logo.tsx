interface LogoProps {
  size?: number;
}

// Réplica em SVG da marca: colchete verde + "ba" (b branco, a verde).
export function Logo({ size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Brain Agriculture"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6FDB9A" />
          <stop offset="100%" stopColor="#2C8F55" />
        </linearGradient>
      </defs>
      <path
        d="M24 28 H76 V56"
        stroke="url(#logoGradient)"
        strokeWidth="9"
        strokeLinecap="square"
        fill="none"
      />
      <text
        x="16"
        y="88"
        fontFamily="'Inter', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="52"
        fill="#FFFFFF"
      >
        b
      </text>
      <text
        x="52"
        y="88"
        fontFamily="'Inter', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="52"
        fill="url(#logoGradient)"
      >
        a
      </text>
    </svg>
  );
}
