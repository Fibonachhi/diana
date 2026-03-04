import type { ButtonHTMLAttributes } from "react";
import styles from "./LiquidGlassButton.module.css";

type Variant = "primary" | "accent" | "ghost";

type LiquidGlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function LiquidGlassButton({ className, variant = "primary", children, ...props }: LiquidGlassButtonProps) {
  const variantClass = {
    primary: styles.primary,
    accent: styles.accent,
    ghost: styles.ghost,
  }[variant];

  const classes = [styles.button, variantClass, className ?? ""].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
