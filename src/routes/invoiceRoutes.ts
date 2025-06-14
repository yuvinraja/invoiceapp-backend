import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
} from "../controllers/invoiceController";

const router = express.Router();

router.post("/", requireAuth, createInvoice);
router.get("/", requireAuth, getInvoices);
router.get("/:id", requireAuth, getInvoiceById);
router.delete("/:id", requireAuth, deleteInvoice);


export default router;
