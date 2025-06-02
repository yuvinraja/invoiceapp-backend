import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getStats, getTopClients } from "../controllers/statsController";

const router = express.Router();

router.get("/summary", requireAuth, getStats);
router.get("/topclients", requireAuth, getTopClients);

export default router;
