import React from "react";

interface MarqueeBannerProps {
  children?: React.ReactNode;
  component?: React.ReactNode;
  text?: string;
  separator?: string;
  repeat?: number;
  bgColor?: string;
  textColor?: string;
  animationDurationInSeconds?: number;
  direction?: "left" | "right";
}

export default function MarqueeBanner({
  children,
  component,
  text = "Open for opportunities",
  separator,
  repeat = 5,
  bgColor = "var(--color-accent)",
  textColor = "var(--color-foreground)",
  animationDurationInSeconds = 30,
  direction = "right",
}: MarqueeBannerProps) {
  const content = component || children;
  const finalSeparator = separator !== undefined ? separator : (content ? "" : "✦");
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="marquee" style={{ backgroundColor: bgColor }}>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className={`marquee-content ${animationClass} py-1`}
          {...(i === 1 ? { "aria-hidden": "true" } : {})}
          style={{ animationDuration: `${animationDurationInSeconds}s` }}
        >
          {Array.from({ length: repeat }).map((_, j) => (
            <React.Fragment key={j}>
              {content ? (
                content
              ) : (
                <span
                  className="text-xs font-medium px-8 tracking-wide"
                  style={{ color: textColor }}
                >
                  {text}
                </span>
              )}
              {finalSeparator && (
                <span
                  className="text-xs font-medium px-8 tracking-wide"
                  style={{ color: textColor }}
                >
                  {finalSeparator}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
