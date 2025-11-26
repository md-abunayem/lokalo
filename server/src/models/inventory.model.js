import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  variantId: {
    // reference to Product.variants._id
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 0,
    min: 0,
  },
  isTrackStock: { type: Boolean, default: true },
  isInStock: {
    type: Boolean,
    default: true,
  },
});

inventorySchema.index(
  {
    shop: 1,
    product: 1,
    variantId: 1,
  },
  { unique: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);