import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number({ required_error: "Amount is required" }),
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type must be income or expense",
  }),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
