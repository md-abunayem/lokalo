import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "order_placed",
        "order_confirmed",
        "order_delivered",
        "order_cancelled",
        "promotion",
        "system",
        "new_message",
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, maxlength: 500 },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    channel: {
      type: String,
      enum: ["push", "email", "sms", "in_app"],
      default: "in_app",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
