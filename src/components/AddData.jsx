"use client";
import React, { useState, useEffect, useCallback } from "react";
import CurrentBalance from "./CurrentBalance";
import axios from "axios";
import Transactions from "./Transactions";
import { Button } from "./ui/button";

function AddData() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");
  const [months, setMonths] = useState([]);
  const [total, setTotal] = useState(0);
  const [spent, setSpent] = useState(0);

  // Fetch the available months
  const fetchMonths = useCallback(async () => {
    try {
      const res = await fetch("/api/months");
      const json = await res.json();
      setMonths(json.months);

      if (!month && json.months.length > 0) {
        const latest = json.months[0]; // Assuming sorted desc
        setMonth(latest);
      }
    } catch (err) {
      console.error("Failed to fetch months", err);
    }
  }, [month]);

  // Fetch Budget Data
  const fetchBudget = useCallback(async (selectedMonth) => {
    try {
      const res = await axios.get(`/api/budget/${selectedMonth}`);
      setTotal(res.data.budget);
      setSpent(res.data.spent);
    } catch (err) {
      console.error("Error fetching budget", err);
    }
  }, []);

  // Fetch Chart Data
  const fetchData = useCallback(async (selectedMonth) => {
    try {
      const res = await fetch(`/api/daily?month=${selectedMonth}`);
      const json = await res.json();
      setData(json.chartData);
    } catch (err) {
      console.error("Failed to fetch chart data", err);
    }
  }, []);

  // Fetch months when the component mounts
  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  // Fetch data when month changes
  useEffect(() => {
    if (month) {
      fetchBudget(month);
      fetchData(month);
    }
  }, [month, fetchBudget, fetchData]);

  if (!month || months.length === 0) {
    return <div>Loading budget data...</div>;
  }

  return (
    <>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="rounded-t-md border px-2 py-1 bg-muted text-foreground text-sm absolute top-[-1.75rem] left-[1rem]"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {new Date(m).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </option>
        ))}
      </select>
      <div className="flex">
        <div className="w-[100%] h-[100%]">
          <Transactions />
        </div>
        <div>
          <CurrentBalance total={total} spent={spent} />
        </div>
      </div>
      <div className="flex items-center gap-2 md:mb-4">
        <Button
          className="bg-accent-foreground text-accent"
          variant="outline"
          onClick={() => {}}
        >
          Add Items
        </Button>
      </div>
    </>
  );
}

export default AddData;
