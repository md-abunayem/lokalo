import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createAddress,
  userAddressesList,
  updateUserAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controllers.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createAddress);
router.get("/", userAddressesList);
router.patch("/:addressId", updateUserAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/default-address", setDefaultAddress);

export default router;
