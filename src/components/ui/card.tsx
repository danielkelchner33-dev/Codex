import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export function Card({ children, glow, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6",
        glow && "shadow-lg shadow-amber-500/5 border-amber-500/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx("text-lg font-semibold text-white", className)}>
      {children}
    </h3>
  );
}
