import * as React from "react"
import { cva } from "class-variance-authority";
import PropTypes from 'prop-types';
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <h5
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
    >
    {children}
  </h5>
))

Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive']),
};

Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
     >
    {children}
  </h5>
))

AlertTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
   >
    {children}
  </div>
))

AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
