import express from "express"
import { createInvoice } from "../controllers/invoiceController"
import { requireAuth } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", requireAuth, createInvoice)

export default router
