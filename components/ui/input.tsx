import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[50px] w-full rounded-xl border border-border-gray bg-white px-4 text-sm text-navy placeholder:text-placeholder outline-none transition-all duration-200 focus:border-pink focus:shadow-[0_0_0_4px_rgba(93,42,26,0.12)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-24 w-full rounded-xl border border-border-gray bg-white px-4 py-3 text-sm text-navy placeholder:text-placeholder outline-none transition-all duration-200 focus:border-pink focus:shadow-[0_0_0_4px_rgba(93,42,26,0.12)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
