import express from "express";
import { signup, login } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
