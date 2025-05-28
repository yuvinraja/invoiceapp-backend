import express from "express"
import { setupProfile } from "../controllers/userController"
import { requireAuth } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/setup-profile", requireAuth, setupProfile)

export default router
