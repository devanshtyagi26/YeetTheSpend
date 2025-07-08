"use client";
import React, { useCallback, useState, useEffect } from "react";
import CircularProgressColorDemo from "./progress-10";
import axios from "axios";

export function renderLabel(num) {
  return `Rs. ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
function CurrentBalance() {
  const [total, setTotal] = useState(0);
  const [spent, setSpent] = useState(0);

  const fetchBudget = useCallback(async () => {
    try {
      const res = await axios.get("/api/budget");
      console.log(res.data.budget);
      setTotal(res.data.budget);
      setSpent(res.data.spent);
    } catch (err) {
      console.error("Error fetching message settings");
    }
  }, []);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  if (total === 0) {
    return (
      <div className="border rounded-xl border-accent flex flex-col p-1 w-fit h-fit">
        Loading budget data...
      </div>
    );
  }
  return (
    <div className="border rounded-xl border-accent flex flex-col px-4 py-1 w-fit h-fit">
      <p className="text-2xl montserrat-medium">Budget</p>
      <CircularProgressColorDemo total={total} spent={spent} />
      <div className="flex items-center justify-between font-bold">
        <div className="flex flex-col justify-center items-center">
          <p className="text-[1.3rem] relative top-1.5">{renderLabel(total)}</p>
          <p className="text-xs font-medium text-red-500">Monthly Total</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-[1.3rem] relative top-1.5">
            {renderLabel(total - spent)}
          </p>
          <p className="text-xs font-medium text-red-500">Remaining</p>
        </div>
      </div>
    </div>
  );
}

export default CurrentBalance;
