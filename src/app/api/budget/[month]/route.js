import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";
import Budget from "@/model/Budget.model";
import { NextResponse } from "next/server";

export async function GET(_, context) {
  await dbConnect();

  const { params } = await context;
  const monthKey = params.month; // e.g., 2025-07

  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return NextResponse.json(
      { success: false, error: "Invalid month format. Use YYYY-MM." },
      { status: 400 }
    );
  }

  try {
    const startOfMonth = new Date(`${monthKey}-01T00:00:00Z`);
    const endOfMonth = new Date(`${monthKey}-31T23:59:59Z`);

    const budgetDoc = await Budget.findOne({ month: monthKey });

    const incomeAgg = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalGained: { $sum: "$amount" },
        },
      },
    ]);

    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = incomeAgg[0]?.totalGained || 0;
    const totalSpent = expenseAgg[0]?.totalSpent || 0;

    return NextResponse.json({
      success: true,
      month: monthKey,
      budget: totalIncome,
      spent: totalSpent,
      manualBudget: budgetDoc?.amount || null,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
