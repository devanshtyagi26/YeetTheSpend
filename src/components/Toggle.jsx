"use client";
import { useState } from "react";
import Graphs from "@/components/Graphs";
import Transactions from "@/components/Transactions";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export default function Toggle() {
  // State to toggle between Graphs and Transactions
  const [showGraphs, setShowGraphs] = useState(true);

  return (
    <>
      <div className="flex flex-col relative justify-self-center h-fit gap-[1rem] md:left-0 left-[10rem] md:top-[0] top-[-2rem]">
        {/* Toggle Button */}
        <div className="flex items-center gap-2 md:mb-4 ">
          <Button variant="outline" onClick={() => setShowGraphs(!showGraphs)}>
            {showGraphs ? "Show Transactions" : "Show Graphs"}
          </Button>
        </div>

        {/* Conditionally Render Graphs or Transactions */}
        <div className="border rounded-xl border-accent flex md:flex-row flex-col justify-center items-center md:w-[60vw] w-[90vw] h-fit md:gap-1.5 mt-10 relative shadow-card-foreground shadow-2xl">
          {showGraphs ? <Graphs /> : <Transactions />}
        </div>
      </div>
    </>
  );
}
