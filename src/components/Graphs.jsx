"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Chart } from "./Chart";
import CircularProgressColorDemo from "./progress-10";
import CurrentBalance from "./CurrentBalance";
import axios from "axios";

function Graphs() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");
  const [months, setMonths] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/daily?month=${month || "latest"}`);
        const json = await res.json();

        setData(json.chartData);
        setMonths(json.availableMonths);
        if (!month) setMonth(json.availableMonths[0]); // default to latest
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    };

    fetchData();
  }, [month]);

  if (total === 0 || data.length < 0 || months.length < 0) {
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
        <Chart month={month} data={data} />
      </div>
      <CurrentBalance total={total} spent={spent} />
    </div>
  );
}

export default Graphs;
