import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(\+8801|01)[3-9]\d{8}$/.test(v);
        },
        message: "Invalid Bangladesh phone number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    avatar: {
      type: String, //cloudinary url
    },
    role: {
      type: String,
      enum: [
        "customer",
        "shop_owner",
        "delivery_partner",
        "admin",
        "super_admin",
      ],
      default: "customer",
      required: true,
      index: true,
    },

    //Address references
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    //shop references(for shop owners)
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      index: true,
    },

    //Rider
    riderProfile: {
      vehicleType: {
        type: String,
        enum: ["bicycle", "motorbike", "car", "van"],
      },
      licenseNumber: { type: String, trim: true },
      nidNumber: { type: String, trim: true },
      isActive: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "suspended",
        "banned",
        "pending_verification",
      ],
      default: "pending_verification",
    },

    //verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerificationToken: String,
    phoneVerificationExpires: Date,

    //Security
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    //preferences
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "en", //Change to "bn" if we want Bangla as default
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },

    //For customer: quick access to current location (e.g. GPS)
    correntLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // GeoJSON coordinates: [lng, lat]
        default: undefined,
      },
    },

    //For sellers: flags
    isSellerApproved: {
      type: Boolean,
      default: false,
    },

    //For delevery partners
    deliveryMeta: {
      vehicleType: {
        type: String,
        enum: ["bike", "car", "bicycle", "walking"],
        default: "bicycle",
      },
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true }
);

//Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//methods
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
