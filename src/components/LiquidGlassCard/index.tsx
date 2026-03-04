import type { HTMLAttributes } from "react";
import styles from "./LiquidGlassCard.module.css";

type LiquidGlassCardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function LiquidGlassCard({ className, hover = true, children, ...props }: LiquidGlassCardProps) {
  const classes = ["liquidGlass", styles.card, hover ? "liquidGlassHover" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <span className="glassEdge" />
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
