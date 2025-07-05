import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";
import { createApiResponse } from "@/lib/apiResponse";
import { createTransactionSchema } from "@/schemas/validationSchema";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const result = createTransactionSchema.safeParse(body);
    if (!result.success) {
      return createApiResponse(
        false,
        result.error.flatten(),
        400,
        result.error.flatten()
      );
    }

    const transaction = await Transaction.create(result.data);
    return Response.json({ success: true, data: transaction }, { status: 200 });
  } catch (err) {
    return createApiResponse(false, err.message, 400, err.message);
  }
}

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find().sort({ date: -1 });
  return Response.json({ success: true, data: transactions });
}
