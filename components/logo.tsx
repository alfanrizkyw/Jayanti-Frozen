export function Logo({
  size = 44,
  tone = "dark",
  className = "",
}: {
  size?: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="flex-none"
      >
        <ellipse cx="24" cy="30.6" rx="13.3" ry="12.9" fill="#102B50" />
        <g className="logo-head">
          <ellipse cx="24" cy="31.7" rx="10.3" ry="9.2" fill="#FCFDFF" />
          <g className="logo-eyes">
            <circle cx="20.3" cy="28.8" r="1.9" fill="#102B50" />
            <circle cx="27.7" cy="28.8" r="1.9" fill="#102B50" />
            <circle cx="19.8" cy="28.2" r="0.55" fill="#fff" />
            <circle cx="27.2" cy="28.2" r="0.55" fill="#fff" />
          </g>
          <path
            d="M21.7 32.4h4.6L25 34.7c-.55.7-1.45.7-2 0l-1.3-2.3Z"
            fill="#F2A03A"
            stroke="#F2A03A"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M13.3 16.7c-3.1 0-5.4-2.2-5.4-5.1 0-2.7 2-4.9 4.7-5.1.7-2.5 3-4.2 5.7-4.2 1.6 0 3.1.7 4.1 1.9.9-1.1 2.2-1.7 3.7-1.7 2.3 0 4.3 1.5 5 3.6 2.8-.1 4.9 2 4.9 4.8 0 2.9-2.3 5.2-5.3 5.2H13.3Z"
            fill="#fff"
            stroke="#102B50"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <rect
            x="13.5"
            y="15.2"
            width="21"
            height="5.2"
            rx="2"
            fill="#E8F3FF"
            stroke="#102B50"
            strokeWidth="1.6"
          />
        </g>
      </svg>
      <span
        className={`logo-word flex flex-col leading-none ${
          tone === "light" ? "logo-word-light" : ""
        }`}
      >
        <span className="text-[19px] font-extrabold tracking-[-0.03em]">
          Jayanti
        </span>
        <span className="mt-[3px] text-[9px] font-bold uppercase tracking-[0.32em]">
          Frozen
        </span>
      </span>
    </span>
  );
}
