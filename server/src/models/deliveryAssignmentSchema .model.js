import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["assigned", "accepted", "picked_up", "delivered", "cancelled"],
      default: "assigned",
      index: true,
    },
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    rejectionReason: { type: String },
    cancellationReason: { type: String },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },
    deliveryProof: {
      type: { type: String, enum: ["photo", "signature", "otp"] },
      url: { type: String },
      verificationCode: { type: String },
    },
    earnings: {
      baseFee: { type: Number, default: 0, min: 0 },
      distanceFee: { type: Number, default: 0, min: 0 },
      tip: { type: Number, default: 0, min: 0 },
      total: { type: Number, default: 0, min: 0 },
    },
    distance: { type: Number, min: 0 },
    duration: { type: Number, min: 0 },
  },
  {
    timestamps: true,
  }
);

deliveryAssignmentSchema.index({ rider: 1, status: 1 });
deliveryAssignmentSchema.index({ currentLocation: "2dsphere" });

export const DeliveryAssignment = mongoose.model(
  "DeliveryAssignment",
  deliveryAssignmentSchema
);
