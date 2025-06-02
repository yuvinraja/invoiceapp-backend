import { Request, Response } from "express";
import prisma from "../config/db";

export const createInvoice = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const {
    invoiceType,
    taxType,
    invoiceDate,
    poNumber,
    vehicleNumber,
    transporter,
    bundleCount,
    client,
    taxRate,
    items,
  } = req.body;

  try {
    const existingClient = await prisma.client.findFirst({
      where: {
        name: client.name,
        userId,
      },
    });

    const clientData = existingClient
      ? existingClient
      : await prisma.client.create({
          data: {
            userId,
            name: client.name,
            gstin: client.gstin,
            address: client.address,
            city: client.city,
            state: client.state,
            pincode: client.pincode,
          },
        });

    // Subtotal
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.rate;
    }, 0);

    let cgst = null;
    let sgst = null;
    let igst = null;

    if (taxType === "CGST_SGST") {
      cgst = (subtotal * taxRate) / 200;
      sgst = (subtotal * taxRate) / 200;
    } else {
      igst = (subtotal * taxRate) / 100;
    }

    const total = subtotal + (cgst ?? 0) + (sgst ?? 0) + (igst ?? 0);
    const roundedTotal = Math.round(total);

    // Get latest invoice number
    const latest = await prisma.invoice.findFirst({
      where: { userId },
      orderBy: { invoiceNumber: "desc" },
    });

    const invoiceNumber = latest ? latest.invoiceNumber + 1 : 1;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId,
        clientId: clientData.id,
        invoiceType,
        taxType,
        taxRate,
        invoiceDate: new Date(invoiceDate),
        poNumber,
        vehicleNumber,
        transporter,
        bundleCount,
        subtotal,
        cgst,
        sgst,
        igst,
        total,
        roundedTotal,
        invoiceNumber,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            hsnCode: item.hsnCode,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({ invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invoice" });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      select: {
        id: true,
        invoiceNumber: true,
        invoiceType: true,
        invoiceDate: true,
        taxType: true,
        total: true,
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { invoiceDate: "desc" },
    });

    res.json(
      invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        invoiceDate: inv.invoiceDate,
        invoiceType: inv.invoiceType,
        taxType: inv.taxType,
        total: inv.total,
        clientName: inv.client ? inv.client.name : null,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve invoices" });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        client: true,
        user: {
          select: {
            name: true,
            email: true,
            company: true,
            gstin: true,
            phone: true,
            mobile: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            logoUrl: true,
            bankDetail: true,
            settings: true,
          },
        },
      },
    });

    if (!invoice || invoice.userId !== userId) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    res.json(invoice);
    return;
  } catch (err) {
    console.error("Error fetching invoice. ", err);
    res.status(500).json({ message: "Failed to retrieve invoice" });
  }
};
