import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
} from "../controllers/invoiceController";

const router = express.Router();

router.post("/", requireAuth, createInvoice);
router.get("/", requireAuth, getInvoices);
router.get("/:id", requireAuth, getInvoiceById);

export default router;
