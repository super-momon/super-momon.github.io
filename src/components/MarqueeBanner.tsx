export default function MarqueeBanner() {
  return (
    <div className="w-full overflow-hidden bg-[var(--color-accent)] py-1">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="text-white text-xs font-medium px-8 tracking-wide">
            ✦&nbsp;&nbsp;Open for opportunities
          </span>
        ))}
      </div>
    </div>
  );
}
