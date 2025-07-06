import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";
import Budget from "@/model/Budget.model";

export async function GET(req) {
  await dbConnect();

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthKey = `${year}-${month}`; // e.g., "2025-07"

    // 🧾 Get budget entry
    const budget = await Budget.findOne({ month: monthKey });
    // const budgetAmount = budget?.amount || 0;

    // 💸 Sum of all expenses this month
    const startOfMonth = new Date(`${monthKey}-01T00:00:00Z`);
    const endOfMonth = new Date(`${monthKey}-31T23:59:59Z`); // fine for approx

    const budgetAmountAgg = await Transaction.aggregate([
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
    const totalSpentAgg = await Transaction.aggregate([
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

    const totalSpent = totalSpentAgg[0]?.totalSpent || 0;
    const budgetAmount = budgetAmountAgg[0]?.totalGained || 0;

    return Response.json({
      success: true,
      month: monthKey,
      budget: budgetAmount,
      spent: totalSpent,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
