import express from "express";
import { setupProfile, me } from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/setup-profile", requireAuth, setupProfile);
router.get("/me", requireAuth, me);

export default router;
