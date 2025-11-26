import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  sku: {
    //MILK-250
    type: String,
    required: true,
  },
  name: {
    //250ml
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  currency: {
    type: String,
    default: "BDT",
  },
  attributes: {
    type: Map,
    of: String,
  },
  barcode: {
    //" BAR-X12345"
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  thumbnail: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    // Search tags
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    variants: {
      type: [variantSchema],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one variant is required",
      },
    },
    totalSold:{
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    searchText:
      "fresh milk organic dairy 1L 500ml meena bazar grocery cow milk",
  },
  {
    timestamps: true,
  }
);

// Methods
productSchema.methods.updateRating = async function (newRating) {
  this.rating.count += 1;
  this.rating.average =
    (this.rating.average * (this.rating.count - 1) + newRating) /
    this.rating.count;
  return this.save();
};
export default mongoose.model("Product", productSchema);
