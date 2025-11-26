import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },
    reviewType: {
      type: String,
      enum: ["product", "shop", "delivery"],
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      index: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String },
    comment: { type: String },
    images: [{ type: String }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, reviewer: 1 }, { unique: false });
reviewSchema.index({ shop: 1, reviewer: 1 }, { unique: false });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model("Review", reviewSchema);
