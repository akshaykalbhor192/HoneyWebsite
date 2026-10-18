// A small illustrated honeybee facing right, with flapping wings.
export default function Bee({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 48" className={className} style={style} aria-hidden>
      <g className="wing" opacity=".85">
        <ellipse cx="26" cy="12" rx="9" ry="13" fill="#ffffff" stroke="#3b1f12" strokeWidth="1.6" transform="rotate(-20 26 12)" />
      </g>
      <g className="wing wing-b" opacity=".7">
        <ellipse cx="34" cy="12" rx="8" ry="12" fill="#eaf6ff" stroke="#3b1f12" strokeWidth="1.6" transform="rotate(18 34 12)" />
      </g>
      {/* body */}
      <ellipse cx="30" cy="30" rx="18" ry="12" fill="#f4b223" stroke="#3b1f12" strokeWidth="2" />
      <path d="M22 19.5c-2.5 6-2.5 15 0 21M30 18c-2.5 7-2.5 17 0 24M38 19.5c-2.2 6-2.2 15 0 21" stroke="#3b1f12" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* stinger */}
      <path d="M12.5 30l-6 1.5 6 1.5z" fill="#3b1f12" />
      {/* head */}
      <circle cx="50" cy="28" r="8" fill="#3b1f12" />
      <circle cx="52.5" cy="26" r="2" fill="#fff" />
      <path d="M52 21c2-5 5-7 8-7M49 20.5c0-5 1.5-8 4-10" stroke="#3b1f12" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
