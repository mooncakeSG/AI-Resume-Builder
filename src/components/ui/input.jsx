import * as React from "react"
import { cn } from "@/lib/utils"
import { inputStyles } from "@/lib/utils/styles"

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  const baseStyle = type === "checkbox" ? inputStyles.checkbox : 
                   type === "radio" ? inputStyles.radio : 
                   inputStyles.base;

  return (
    <input
      type={type}
      className={cn(
        baseStyle,
        error && "border-red-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input } 