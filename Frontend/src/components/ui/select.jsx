import * as React from "react";
import { cn } from "../../pages/lib/utils";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <Select ref={ref} className={className} {...props}>
    {children}
  </Select>
));
SelectTrigger.displayName = "SelectTrigger";

// eslint-disable-next-line no-unused-vars
const SelectValue = React.forwardRef(({ placeholder, ...props }, ref) => (
  <option value="" disabled hidden>
    {placeholder}
  </option>
));
SelectValue.displayName = "SelectValue";

const SelectContent = ({ children }) => <>{children}</>;
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none", className)}
    {...props}
  >
    {children}
  </option>
));
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };


