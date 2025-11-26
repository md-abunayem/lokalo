import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 100,
    },
    nameTranslations: {
      en: {
        type: String,
      },
      bn: {
        t,
      },
    },
    parent :{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive:{
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },

  },
  {
    timestamps: true,
  }
);

categorySchema.index({parent: 1, name: 1}, {unique: true});

const Category = mongoose.model("Category", categorySchema);