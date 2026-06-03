import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "placeholder:text-gray-400",
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
