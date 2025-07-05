import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/Transactions.model";
import { createApiResponse } from "@/lib/apiResponse";
import { updateTransactionSchema } from "@/schemas/updateTransactionSchema";

export async function PUT(req, context) {
  await dbConnect();
  const { params } = await context;

  try {
    const body = await req.json();

    const result = updateTransactionSchema.safeParse(body);
    if (!result.success) {
      return createApiResponse(
        false,
        result.error.flatten(),
        400,
        result.error.flatten()
      );
    }

    const updated = await Transaction.findByIdAndUpdate(
      params.id,
      result.data,
      {
        new: true,
      }
    );

    return Response.json({ success: true, data: updated });
  } catch (err) {
    return createApiResponse(false, err.message, 400, err.message);
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const { params } = await context;

  try {
    await Transaction.findByIdAndDelete(params.id);
    return createApiResponse(true, "Transaction deleted successfully", 200);
  } catch (err) {
    return createApiResponse(false, err.message, 400, err.message);
  }
}
