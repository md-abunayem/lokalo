import { Router } from "express";
import {
  listUsers,
  updateUserStatus,
  updateUserRole,
} from "../controllers/user.controllers.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("admin", "super_admin"));

//routes
router.route("/").get(listUsers); //admin and super_admin can access
router.route("/:userId/status").patch(updateUserStatus); //admin and super_admin can modify
router
  .route("/:userId/role")
  .patch(authorizeRoles("super_admin"), updateUserRole); //only super_admin can modify

export default router;
