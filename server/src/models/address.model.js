import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    label: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      validate: {
        validator: v => /^(\+8801|01)[3-9]\d{8}$/.test(v),
        message: "Invalid Bangladesh phone number",
      },
    },

    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    division: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true, default: "Bangladesh" },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: false, // change to true if required
        validate: {
          validator: v => !v || (v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90),
          message: "Invalid coordinates",
        },
      },
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

addressSchema.index({ location: "2dsphere" });

export const Address = mongoose.model("Address", addressSchema);
