import mongoose from "mongoose";
import { addressSchema } from "./address.model.js";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  varientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  varientName: {
    type: String,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    //lineTotal
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Single-shop per order simplifies operations; if I want later multi-shop, split orders internally.

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: [
        "pending", // created, awaiting confirmation
        "confirmed", // shop confirmed
        "preparing", // being prepared
        "ready_for_pickup",
        "assigned_rider",
        "on_the_way",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "mobile_banking", "wallet", "other"],
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },
    deliveryAddress: addressSchema,
    pricing: {
      itemsTotal: { type: Number, required: true },
      deliveryFee: { type: Number, default: 0 },
      discountTotal: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
      currency: { type: String, default: "BDT" },
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: { type: String },
    customerNote: { type: String },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ shop: 1, status: 1 });

export const Order = mongoose.model("Order", orderSchema);
