import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({
  className,
  error,
  children,
  ...props
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg bg-white text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";
  
  const stateClasses = error
    ? "border-error focus:ring-error focus:border-error"
    : "border-gray-300 focus:ring-primary focus:border-primary hover:border-gray-400";

  return (
    <select
      ref={ref}
      className={cn(
        baseClasses,
        stateClasses,
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;