import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String, //cloudinary url
    },
    coverImage: {
      type: String, //cloudinary url
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      reg: "Category",
    },
    businessLicense: {
      number: {
        type: String,
      },
      image: {
        type: String, //cloudinary url
      },
      isVarified: {
        type: Boolean,
      },
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
      index: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    // Operation hours
    openingHours: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 }, // 0=Sunday
        openTime: { type: String }, // "09:00"
        closeTime: { type: String }, // "18:00"
        isClosed: { type: Boolean, default: false },
      },
    ],
    deliveryConfig: {
      supportsDelivery: { type: Boolean, default: true },
      supportsPickup: { type: Boolean, default: true },
      minOrderAmount: { type: Number, default: 0 },
      baseDeliveryFee: { type: Number, default: 0 },
      perKmFee: { type: Number, default: 0 },
    },
    mobileBankingDetails: {
      accountNumber: { type: String },
      type: { type: String }, //"bKash", "Nagad"
      bankName: { type: String },

    },
    commission:{
        rate: {
            type: Number,
            default: 5, //percentage
            min: 0,
            max: 100
        },
        type: {
            type: String,
            enum: ["percentage", "fixed"],
            default: "percentage"
        }
    },
    totalOrders:{
        type: Number,
        default: 0,
        min: 0
    },
    totalRevenue:{
        type: Number,
        default: 0,
        min: 0
    }
  },
  {
    timestamps: true,
  }
);

shopSchema.methods.updateRating = function (newRating){
    this.rating.count += 1;
    this.rating.average = ((this.rating.average * (this.rating.count -1 )) + newRating) / this.rating.count;
    return this.save();
}

export const Shop = mongoose.model("Shop", shopSchema);
