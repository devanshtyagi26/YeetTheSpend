"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const datsdfa = [
  {
    _id: "6869095d6d79e1dd05020df9",
    amount: 1300,
    type: "expense",
    description: "Prime subscription",
    category: "Entertainment",
    date: "2025-07-05T10:10:00.000+00:00",
    uuid: "c7c59d09-82ee-4da4-aff7-e524128efd33",
  },
  {
    _id: "someOtherId",
    amount: 500,
    type: "income",
    description: "Freelance payment",
    category: "Work",
    date: "2025-07-04T09:00:00.000+00:00",
    uuid: "some-other-uuid",
  },
  // More transactions
];

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "serial",
    header: "S.No",
    cell: ({ row }) => row.index + 1, // Serial number based on row index
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    filter: "includes", // Filter functionality on 'type'
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      // Function to copy the transaction details to the clipboard
      const copyTransactionDetails = () => {
        const details = `
          Transaction ID: ${transaction._id}
          Amount: ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(transaction.amount)}
          Type: ${transaction.type}
          Description: ${transaction.description}
          Category: ${transaction.category}
          Date: ${new Date(transaction.date).toLocaleString()}
        `;

        navigator.clipboard.writeText(details).then(() => {
          alert("Transaction details copied to clipboard");
        });
      };

      // Function to handle transaction deletion (mock functionality)
      const deleteTransaction = () => {
        const isConfirmed = window.confirm(
          "Are you sure you want to delete this transaction?"
        );
        if (isConfirmed) {
          // Call your delete API here (this is just a placeholder for now)
          console.log("Transaction deleted:", transaction._id);
          alert("Transaction deleted successfully");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {/* Copy Transaction ID */}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction._id)}
            >
              Copy transaction ID
            </DropdownMenuItem>

            {/* Copy Transaction Details */}
            <DropdownMenuItem onClick={copyTransactionDetails}>
              Copy transaction details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete Transaction */}
            <DropdownMenuItem
              onClick={deleteTransaction}
              className="text-red-500"
            >
              Delete transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Filter function to only show transactions for the selected month
const filterByMonth = (data, month) => {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid data:", data);
    return []; // Return empty if data is invalid
  }

  if (!month) {
    console.error("Month is not defined:", month);
    return data; // Return original data if no month is passed
  }

  console.log("Filtering for month:", month);

  return data.filter((item) => {
    const transactionMonth = item.date.slice(0, 7); // Get "YYYY-MM"
    console.log("Comparing:", transactionMonth, "with", month);
    return transactionMonth === month; // Only return transactions for the selected month
  });
};

export default function DataTable({ month }) {
  console.log("Table Month", month);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch Chart Data
  const fetchData = async (selectedMonth) => {
    try {
      const res = await fetch(
        `/api/daily?month=${selectedMonth}&filterPositive=true`
      );
      const json = await res.json();
      console.log("API Response:", json); // Log response data
      const chartData = json.chartData;

      // Check if the data exists and is an array
      if (!Array.isArray(chartData)) {
        console.error("Expected chartData to be an array, got:", chartData);
        return [];
      }

      const mappedData = chartData.flatMap((entry) => {
        return [
          {
            date: entry.date,
            type: "income",
            description: "Income",
            category: "General",
            amount: entry.income,
          },
          {
            date: entry.date,
            type: "expense",
            description: "Expense",
            category: "General",
            amount: entry.expense,
          },
        ];
      });

      console.log("Mapped Data:", mappedData); // Check if data is mapped correctly
      return mappedData;
    } catch (err) {
      console.error("Failed to fetch chart data", err);
      return [];
    }
  };

  useEffect(() => {
    if (month) {
      console.log("Fetching data for month:", month); // Log to check the month
      fetchData(month).then((mappedData) => {
        console.log("Mapped Data received:", mappedData); // Check the mapped data
        setData(mappedData);
      });
    } else {
      console.error("Month is undefined or null");
    }
  }, [month]);

  useEffect(() => {
    console.log("Updated data:", data);
  }, [data]); // This will log whenever `data` is updated

  const [columnFilters, setColumnFilters] = React.useState([
    { id: "type", value: "" }, // Default empty filter
  ]);

  // Ensure filteredData is never undefined, fallback to an empty array
  const filteredData = React.useMemo(
    () => filterByMonth(data, month),
    [data, month]
  );
  console.log("Filtered Data:", filteredData);

  const table = useReactTable({
    data: filteredData, // <-- Use 'filteredData' here, not 'filteredData' directly in 'columns'
    columns,
    state: {
      columnFilters,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection);
      localStorage.setItem(
        "rowSelectionState",
        JSON.stringify(newRowSelection)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-[1fr_auto_auto] md:gap-x-2 items-center gap-2 py-4">
        <Input
          placeholder="Filter Items..."
          value={table.getColumn("description")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2 md:contents">
          <div className="flex items-center gap-2 py-4 md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Filter by Type <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    setColumnFilters([{ id: "type", value: "income" }])
                  }
                >
                  Income
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setColumnFilters([{ id: "type", value: "expense" }])
                  }
                >
                  Expense
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setColumnFilters([{ id: "type", value: "" }])}
                >
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 py-4 md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {console.log("Log", table.getRowModel().rows.length)}
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
