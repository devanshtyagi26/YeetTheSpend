"use client";
import * as React from "react";

// import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const CircularProgress = ({
  total,
  spent,
  renderLabel,
  className,
  progressClassName,
  showLabel,
  shape = "round",
  size = 100,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
}) => {
  const radius = size / 2 - 10;
  const circumference = Math.ceil(3.14 * radius * 2);
  const val = (spent / total) * 100;
  const percentage = Math.ceil(circumference * ((100 - val) / 100));

  const viewBox = `-${size * 0.125} -${size * 0.125} ${size * 1.25} ${
    size * 1.25
  }`;

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
        className="relative"
      >
        {/* Base Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className={cn("stroke-primary/25", className)}
        />

        {/* Progress */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDashoffset={percentage}
          fill="transparent"
          strokeDasharray={circumference}
          className={cn("stroke-primary", progressClassName)}
        />
      </svg>
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center font-bold"
          )}
        >
          <span className="text-2xl">
            {renderLabel ? renderLabel(spent) : spent}
          </span>

          <span className="text-xs font-medium">Spent</span>
        </div>
      )}
    </div>
  );
};

export default function CircularProgressColorDemo() {
  const [total, setTotal] = React.useState([13000]);
  const [spent, setSpent] = React.useState([6500]);
  const size = 200;

  return (
    <div className="max-w-xs mx-auto w-full flex flex-col items-center">
      <div className="flex items-center gap-1">
        <CircularProgress
          total={total[0]}
          spent={spent[0]}
          size={size}
          strokeWidth={size / 6}
          showLabel={true}
          renderLabel={(spent) => `Rs. ${spent}`}
          className="stroke-accent"
          progressClassName="stroke-accent-foreground"
        />
      </div>
    </div>
  );
}
