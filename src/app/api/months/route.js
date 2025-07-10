import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const months = await Transaction.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" },
          },
        },
      },
      {
        $sort: { _id: -1 }, // Sort by newest month first (optional)
      },
      {
        $project: {
          month: "$_id",
          _id: 0,
        },
      },
    ]);

    const monthList = months.map((m) => m.month);

    return NextResponse.json({
      success: true,
      months: monthList,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
