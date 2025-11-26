import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["bkash", "nagad", "rocket", "sslcommerz", "stripe", "cod"],

      required: true,
    },
    providerTransactionId: { type: String, index: true, sparse: true },
    //Some payments (like COD) don’t have a transaction ID.
    // sparse: true allows indexing only when the field exists, preventing errors.
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: [
        "initiated",
        "processing",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      default: "initiated",
      index: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
    errorCode: { type: String },
    errorMessage: { type: String },
    refundAmount: { type: Number, default: 0, min: 0 },
    refundedAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
paymentSchema.index({ provider: 1, status: 1 });
export const Payment = mongoose.model("Payment", paymentSchema);
