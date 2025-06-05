import express from "express";
import {
  setupProfile,
  me,
  updateProfile,
  updateBankDetails,
  updateSettings,
} from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/setup-profile", requireAuth, setupProfile);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateProfile);
router.patch("/me/bank", requireAuth, updateBankDetails);
router.patch("/me/settings", requireAuth, updateSettings);

export default router;
