"use client";

import { cn } from "@/lib/cn";
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function FieldShell({
  label,
  error,
  hint,
  required,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-text-2">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-xs text-red">{error}</span>
      ) : hint ? (
        <span className="text-xs text-text-3">{hint}</span>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, required, ...props }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        className={cn(
          "bg-glass-2 border border-border rounded-[10px] px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-3 focus:border-border-2",
          error && "border-red/60",
          className
        )}
        {...props}
      />
    </FieldShell>
  )
);
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, required, ...props }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        className={cn(
          "bg-glass-2 border border-border rounded-[10px] px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-3 focus:border-border-2 resize-y",
          error && "border-red/60",
          className
        )}
        {...props}
      />
    </FieldShell>
  )
);
Textarea.displayName = "Textarea";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldWrapperProps;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, required, children, ...props }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        className={cn(
          "bg-glass-2 border border-border rounded-[10px] px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-border-2 cursor-pointer",
          error && "border-red/60",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  )
);
Select.displayName = "Select";
