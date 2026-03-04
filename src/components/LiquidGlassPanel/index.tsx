import type { HTMLAttributes } from "react";
import styles from "./LiquidGlassPanel.module.css";

type LiquidGlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function LiquidGlassPanel({ className, hover = false, children, ...props }: LiquidGlassPanelProps) {
  const classes = ["liquidGlass", styles.panel, hover ? "liquidGlassHover" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <span className="glassEdge" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
