import * as React from "react"
import { cn } from "@/lib/utils"
import { inputStyles } from "@/lib/utils/styles"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(inputStyles.textarea, className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea } 