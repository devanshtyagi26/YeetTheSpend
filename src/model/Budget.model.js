import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  month: {
    type: String, // Format: "2025-07"
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
export default Budget;
