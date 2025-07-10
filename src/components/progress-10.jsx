"use client";
import { useEffect, useCallback, useState } from "react";
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
  const val = total > 0 ? (spent / total) * 100 : 0;

  const percentage =
    total > 0 ? Math.ceil(circumference * ((100 - val) / 100)) : circumference;

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
          <span className="md:text-3xl text-[1.3rem] relative top-1.5">
            {renderLabel ? renderLabel(spent) : spent}
          </span>

          <span className="text-xs font-medium text-red-500">Spent</span>
        </div>
      )}
    </div>
  );
};

export default function CircularProgressColorDemo({ total, spent }) {
  const [size, setSize] = useState(250); // Default size for larger screens
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check window size
    const checkIfMobile = () => {
      if (window.innerWidth <= 640) {
        setSize(200); // Smaller size on mobile
        setIsMobile(true);
      } else {
        setSize(250); // Default size on larger screens
        setIsMobile(false);
      }
    };

    // Add resize event listener
    window.addEventListener("resize", checkIfMobile);

    // Check on initial render
    checkIfMobile();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []); // Empty dependency array to run only once on mount

  console.log(total, spent);
  if (total === 0) {
    return <></>;
  }

  return (
    <div className="max-w-xs mx-auto w-full flex flex-col items-center">
      <div className="flex items-center gap-1">
        <CircularProgress
          total={total}
          spent={spent}
          size={size}
          strokeWidth={size / 6}
          showLabel={true}
          renderLabel={(spent) => {
            if (spent == null || isNaN(spent)) return "Rs. 0";
            return `Rs. ${spent
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
          }}
          className="stroke-accent"
          progressClassName="stroke-accent-foreground"
        />
      </div>
    </div>
  );
}
