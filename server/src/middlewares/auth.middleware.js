import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

//verify JWT middleware
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-refreshToken -__v"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized request - user not found");
    }

    req.user = user; //attach user to request object
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized request");
  }
});

export const authorizeRoles = (...roles) => {    //roles here is rest operator(collects all the arguments passesd into authorizeRoles function and stores in a real array)
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: insufficient permissions");
    }
    next();
  };
};
