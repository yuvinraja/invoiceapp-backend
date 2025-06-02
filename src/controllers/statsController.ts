import { Request, Response } from "express";
import prisma from "../config/db";

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  console.log(`Fetching stats for user: ${userId}`);

  try {
    const totalInvoices = await prisma.invoice.count({
      where: { userId },
    });
    console.log(`Total invoices: ${totalInvoices}`);

    const totalRevenueResult = await prisma.invoice.aggregate({
      _sum: {
        roundedTotal: true,
      },
      where: { userId },
    });
    console.log(`Total revenue result: ${JSON.stringify(totalRevenueResult)}`);

    const byInvoiceType = await prisma.invoice.groupBy({
      by: ["invoiceType"],
      where: { userId },
      _count: {
        invoiceType: true,
      },
    });
    console.log(`By invoice type: ${JSON.stringify(byInvoiceType)}`);

    const byTaxTypeRaw = await prisma.invoice.findMany({
      where: { userId },
      select: { taxType: true },
    });

    const byTaxType = byTaxTypeRaw.reduce((acc, inv) => {
      acc[inv.taxType] = (acc[inv.taxType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`By tax type: ${JSON.stringify(byTaxType)}`);

    const totalRevenue = totalRevenueResult._sum?.roundedTotal ?? 0;
    const averageInvoiceValue =
      totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    const response = {
      totalInvoices,
      totalRevenue,
      averageInvoiceValue,
      byInvoiceType: Object.fromEntries(
        byInvoiceType.map((i) => [i.invoiceType, i._count.invoiceType])
      ),
      byTaxType,
    };
    console.log(`Sending response: ${JSON.stringify(response)}`);

    res.status(200).json(response);
    return;
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTopClients = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  console.log(`Fetching top clients for user: ${userId}`);

  try {
    const result = await prisma.invoice.groupBy({
      by: ["clientId"],
      where: { userId, clientId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });
    console.log(`Group by result: ${JSON.stringify(result)}`);

    const clientIds = result.map((r) => r.clientId!);
    console.log(`Client IDs: ${JSON.stringify(clientIds)}`);

    const clients = await prisma.client.findMany({
      where: { id: { in: clientIds } },
    });
    console.log(`Clients: ${JSON.stringify(clients)}`);

    const enriched = result.map((group) => {
      const client = clients.find((c) => c.id === group.clientId);
      return {
        clientId: group.clientId,
        name: client?.name || "Unknown",
        invoiceCount: group._count.id,
      };
    });
    console.log(`Enriched data: ${JSON.stringify(enriched)}`);

    res.json(enriched);
    return;
  } catch (err) {
    console.error("Error fetching top clients", err);
    res.status(500).json({ message: "Failed to fetch top clients" });
  }
};
