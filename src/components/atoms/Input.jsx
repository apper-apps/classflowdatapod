import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className,
  type = "text",
  error,
  ...props
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";
  
  const stateClasses = error
    ? "border-error focus:ring-error focus:border-error"
    : "border-gray-300 focus:ring-primary focus:border-primary hover:border-gray-400";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        stateClasses,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;