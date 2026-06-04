interface MarqueeBannerProps {
  text?: string;
  separator?: string;
  repeat?: number;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export default function MarqueeBanner({
  text = "Open for opportunities",
  separator = "✦",
  repeat = 12,
  bgColor = "var(--color-accent)",
  textColor = "white",
  className = "",
}: MarqueeBannerProps) {
  return (
    <div
      className={`w-full overflow-hidden py-1 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: repeat }).map((_, i) => (
          <span
            key={i}
            className="text-xs font-medium px-8 tracking-wide"
            style={{ color: textColor }}
          >
            {separator}&nbsp;&nbsp;{text}
          </span>
        ))}
      </div>
    </div>
  );
}
