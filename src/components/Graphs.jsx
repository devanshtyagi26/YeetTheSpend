"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Chart } from "./Chart";
import CurrentBalance from "./CurrentBalance";
import axios from "axios";

function Graphs() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");
  const [months, setMonths] = useState([]);
  const [total, setTotal] = useState(0);
  const [spent, setSpent] = useState(0);

  const fetchBudget = useCallback(async (selectedMonth) => {
    try {
      console.log("Month", selectedMonth);
      const res = await axios.get(`/api/budget/${selectedMonth}`);
      console.log("res", res.data);
      setTotal(res.data.budget);
      setSpent(res.data.spent);
    } catch (err) {
      console.error("Error fetching budget", err);
    }
  }, []);

  const fetchChartData = useCallback(async (selectedMonth) => {
    try {
      const res = await fetch(`/api/daily?month=${selectedMonth}`);
      const json = await res.json();
      setData(json.chartData);
    } catch (err) {
      console.error("Failed to fetch chart data", err);
    }
  }, []);

  // Fetch available months once
  useEffect(() => {
    const fetchMonths = async () => {
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
    };

    fetchMonths();
  }, []);

  // Fetch data when month changes
  useEffect(() => {
    if (month) {
      fetchBudget(month);
      fetchChartData(month);
    }
  }, [month, fetchBudget, fetchChartData]);

  if (!month || months.length === 0) {
    return (
      <div className="border rounded-xl border-accent flex flex-col p-1 w-fit h-fit">
        Loading budget data...
      </div>
    );
  }

  return (
    <div className="border rounded-xl border-accent flex justify-center items-center w-[60vw] h-fit gap-1.5 mt-10 relative shadow-card-foreground shadow-2xl">
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
      <div className="flex h-fit w-[40rem]">
        {console.log("total", total, "data", data)}
        <Chart month={month} data={data} />
      </div>
      <CurrentBalance total={total} spent={spent} />
    </div>
  );
}

export default Graphs;
