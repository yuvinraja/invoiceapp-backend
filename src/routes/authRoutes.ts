import express from "express";
import { signup, login, me } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);

export default router;
