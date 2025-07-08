import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get("month");

  if (!monthParam) {
    return Response.json(
      { error: "Missing 'month' query param" },
      { status: 400 }
    );
  }

  const startDate = new Date(`${monthParam}-01`);
  const endDate = new Date(`${monthParam}-31T23:59:59.999Z`);

  try {
    // 🔹 Get daily data
    const data = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // 🔹 Format daily income/expense
    const dailyMap = {};
    for (let i = 1; i <= 31; i++) {
      const dateStr = `${monthParam}-${String(i).padStart(2, "0")}`;
      dailyMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
    }

    data.forEach((item) => {
      const day = item._id.day;
      const type = item._id.type;
      const dateStr = `${monthParam}-${String(day).padStart(2, "0")}`;
      if (dailyMap[dateStr]) {
        dailyMap[dateStr][type] = item.total;
      }
    });

    const chartData = Object.values(dailyMap);

    // 🔹 Get all available months
    const allMonthsAgg = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    const availableMonths = allMonthsAgg.map((entry) => {
      const year = entry._id.year;
      const month = String(entry._id.month).padStart(2, "0");
      return `${year}-${month}`;
    });

    return Response.json({
      chartData,
      availableMonths,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
