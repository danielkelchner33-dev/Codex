"use client";

import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50",
          "transition-all duration-200",
          error ? "border-red-500/50" : "border-white/10",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={clsx(
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50",
          "transition-all duration-200 resize-none",
          error ? "border-red-500/50" : "border-white/10",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
