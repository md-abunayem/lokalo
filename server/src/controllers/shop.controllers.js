import Shop from "../models/shop.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

//CREATE SHOP
const createShop = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    throw new ApiError(401, "Unauthorized - user not authenticated");
  }

  const {
    name,
    description,
    phone,
    email,
    whatsappNumber,
    addresss,
    category,
    logo,
    coverImage,
    businessLicense,
    deliveryConfig,
    mobileBankingDetails,
    openingHours,
  } = req.body;

  if (!name || !description || !phone || !address) {
    throw new ApiError(
      400,
      "name, description, phone and address are required"
    );
  }

  
});

//SHOP IMAGE UPLOAD
const uploadShopImages = asyncHandler(async (req, res) => {});
