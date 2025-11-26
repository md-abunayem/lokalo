import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscountAmount: {
      // for percentage type only
      type: Number,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      // total usages
      type: Number,
      min: 1,
    },
    usageCount: { type: Number, default: 0, min: 0 },
    usagePerUser: {
      // usages per user
      type: Number,
      default: 1,
      min: 1,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    applicableShops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    userEligibility: {
      type: String,
      enum: ["all", "new_users", "existing_users"],
      default: "all",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

export const Coupon = mongoose.model("Coupon", couponSchema);
