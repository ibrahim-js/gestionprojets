import express from "express";

import {
  authUser,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
  getMe,
  fetchUsers,
  deleteUser,
  updateUserByAdmin,
} from "../controllers/users.js";
import { authorizeRoles, protect } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("Administrateur"), registerUser)
  .get(protect, authorizeRoles("Administrateur"), fetchUsers)
  .put(protect, authorizeRoles("Administrateur"), updateUserByAdmin)
  .delete(protect, authorizeRoles("Administrateur"), deleteUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get("/me", protect, getMe);

export default router;
