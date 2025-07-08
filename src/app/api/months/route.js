import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";

export async function GET() {
  await dbConnect();

  try {
    const data = await Transaction.aggregate([
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

    const months = data.map((d) => {
      const year = d._id.year;
      const month = String(d._id.month).padStart(2, "0");
      return `${year}-${month}`;
    });

    return Response.json(months);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
