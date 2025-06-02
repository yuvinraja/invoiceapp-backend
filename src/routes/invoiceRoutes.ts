import express from "express"
import { createInvoice, getInvoices, getInvoiceById } from "../controllers/invoiceController"
import { requireAuth } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", requireAuth, createInvoice)
router.get("/", requireAuth, getInvoices)
router.get("/:id", requireAuth, getInvoiceById)


export default router
