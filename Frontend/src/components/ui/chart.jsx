import * as React from "react";
import { cn } from "../../pages/lib/utils";

// eslint-disable-next-line no-unused-vars
const ChartContainer = ({ children, config, className }) => (
  <div className={cn("w-full h-full", className)}>{children}</div>
);

const ChartTooltip = ({ children }) => children;

const ChartTooltipContent = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      {label && <p className="text-sm font-medium mb-2">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ChartContainer, ChartTooltip, ChartTooltipContent };


