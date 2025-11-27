import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const payload = { ...req.body };

  payload.user = userId; //attached owner to the address document
  payload.isDefault = Boolean(payload.isDefault);

  const address = await Address.create(payload);

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { addresses: address._id } },
    { new: true }
  );

  if (payload.isDefault) {
    await Address.updateMany(
      { _id: { $ne: address._id }, user: userId },
      { isDefault: false }
    );
  }

  return res.status(201).json(new ApiResponse(201, address, "Address created"));
});

//list of addresses of an user
const userAddressesList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User is not  found..");
  }

  const addresses = user?.addresses || [];

  return res
    .status(200)
    .json(
      new ApiResponse(200, addresses, "User addresses fetched successfully")
    );
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;
  const newAddress = req.body;

  const user = await User.findById(userId);
  if (!user || !user.addresses.some((id) => id.toString() === addressId)) {
    throw new ApiError(404, "Address not found for this user");
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    addressId,
    newAddress,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAddress) {
    throw new ApiError(404, "Address not found");
  }

  if (payload.isDefault === true) {
    //use a checkbox in front end for making default
    await Address.updateMany(
      { _id: { $ne: updatedAddress._id }, user: userId },
      { isDefault: false }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Address updated"));
});

//DELETE A ADDRESS
const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user?._id); //from JWT
  if (!user || !user.addresses.some((id) => id.toString() === addressId)) {
    throw new ApiError(404, "Address not found for this user");
  }

  await Address.findByIdAndDelete(addressId);

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { addresses: addressId },
  });

  return res.status(200).json(new ApiResponse(200, null, "Address deleted"));
});

//SET DEFAULT ADDRESS
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user._id);

  // Validate address ownership
  if (!user || !user.addresses.some((id) => id.toString() === addressId)) {
    throw new ApiError(404, "Address not found for this user");
  }

  // Remove default from all addresses
  await Address.updateMany(
    { _id: { $in: user.addresses } },
    { isDefault: false }
  );

  // Set this one as default
  const address = await Address.findByIdAndUpdate(
    addressId,
    { isDefault: true },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Default address set"));
});

export {
  createAddress,
  userAddressesList,
  updateUserAddress,
  deleteAddress,
  setDefaultAddress,
};
