import React from "react";

interface MarqueeBannerProps {
  text?: string;
  separator?: string;
  repeat?: number;
  bgColor?: string;
  textColor?: string;
  animationDurationInSeconds?: number;
}

export default function MarqueeBanner({
  text = "Open for opportunities",
  separator = "✦",
  repeat = 5,
  bgColor = "var(--color-accent)",
  textColor = "white",
  animationDurationInSeconds = 30,
}: MarqueeBannerProps) {
  return (
    <div className={'marquee'}
      style={{ backgroundColor: bgColor }}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className={'marquee-content animate-marquee py-1'} {...(i === 1 ? { 'aria-hidden': 'true' } : {})} style={{ animationDuration: `${animationDurationInSeconds}s` }}>
          {Array.from({ length: repeat }).map((_, j) => (
            <React.Fragment key={j}>
              <span
                className="text-xs font-medium px-8 tracking-wide"
                style={{ color: textColor }}
              >
                {text}
              </span>
              <span className="text-xs font-medium px-8 tracking-wide"
                style={{ color: textColor }}>{separator}</span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
