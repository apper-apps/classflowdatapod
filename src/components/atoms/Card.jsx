import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className,
  children,
  hover = false,
  gradient = false,
  ...props
}, ref) => {
  const baseClasses = "bg-white rounded-xl border border-gray-200 overflow-hidden";
  
  const hoverClasses = hover 
    ? "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer" 
    : "";
    
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-white to-gray-50"
    : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        hoverClasses,
        gradientClasses,
        "shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;