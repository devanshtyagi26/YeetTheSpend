import { z } from "zod";

export const updateTransactionSchema = z.object({
  amount: z.number().optional(),
  type: z.enum(["income", "expense"]).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});
