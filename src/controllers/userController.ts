import { Request, Response } from "express";
import prisma from "../config/db";

export const setupProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).userId;
  const {
    company,
    gstin,
    phone,
    mobile,
    address,
    city,
    state,
    pincode,
    logoUrl,
    bank,
    terms,
  } = req.body;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      include: { bankDetail: true },
    });

    if (!existing) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (existing.bankDetail) {
      res.status(400).json({ message: "Profile already setup" });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        company,
        gstin,
        phone,
        mobile,
        address,
        city,
        state,
        pincode,
        logoUrl,
        bankDetail: {
          create: {
            bankName: bank.bankName,
            branch: bank.branch,
            accountNo: bank.accountNo,
            ifscCode: bank.ifscCode,
          },
        },
        settings: {
          create: {
            terms,
          },
        },
      },
    });

    res.status(200).json({ message: "Profile setup complete" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during profile setup" });
    return;
  }
};
