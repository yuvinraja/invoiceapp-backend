import express from "express"
import { createInvoice, getInvoices } from "../controllers/invoiceController"
import { requireAuth } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", requireAuth, createInvoice)
router.get("/", requireAuth, getInvoices)


export default router
