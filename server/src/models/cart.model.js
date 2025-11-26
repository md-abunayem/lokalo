import mongoose from "mongoose";


const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    varientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 999,
    },
    priceSnapshot: {
      // price of the varient at time added to cart
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      unique: true,
    },
    items: [cartItemSchema],
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    discountTotal: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "BDT",
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.calulateTotals = function () {
  this.subTotal = this.items.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );
  this.discountTotal = this.discountTotal || 0;
  this.grandTotal = this.subTotal - this.discountTotal;
  return this;
};

export const Cart = mongoose.model("Cart", cartSchema);
