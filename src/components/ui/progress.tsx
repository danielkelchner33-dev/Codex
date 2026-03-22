import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "amber" | "emerald" | "blue" | "red";
  className?: string;
}

const colorStyles = {
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  color = "amber",
  className,
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={clsx("space-y-1.5", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showPercent && <span className="text-gray-300 font-medium">{percent}%</span>}
        </div>
      )}
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
