import express from "express";
import {
  setupProfile,
  me,
  updateProfile,
  updateBankDetails,
  updateSettings,
  uploadLogo
} from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";
import upload from "../lib/multer";

const router = express.Router();

router.post("/setup-profile", requireAuth, setupProfile);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateProfile);
router.patch("/me/bank", requireAuth, updateBankDetails);
router.patch("/me/settings", requireAuth, updateSettings);
router.post("/upload-logo", upload.single("logo"), requireAuth, uploadLogo);

export default router;
