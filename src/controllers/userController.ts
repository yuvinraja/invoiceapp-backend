import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import upload from "../lib/multer";

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

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { bankDetail: true, settings: true },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch user" });
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  console.log("Updating profile for userId:", userId);
  console.log("New profile data:", req.body);

  const {
    name,
    company,
    gstin,
    phone,
    mobile,
    address,
    city,
    state,
    pincode,
    logoUrl,
  } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        company,
        gstin,
        phone,
        mobile,
        address,
        city,
        state,
        pincode,
        logoUrl,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during profile update" });
  }
};

export const updateBankDetails = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { bankName, branch, accountNo, ifscCode } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        bankDetail: {
          upsert: {
            create: {
              bankName,
              branch,
              accountNo,
              ifscCode,
            },
            update: {
              bankName,
              branch,
              accountNo,
              ifscCode,
            },
          },
        },
      },
      include: {
        bankDetail: true, // Include the bank details in the response
      },
    });

    res
      .status(200)
      .json({ message: "Bank details updated successfully", user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error during bank details update" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { terms } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        settings: {
          upsert: {
            create: {
              terms,
            },
            update: {
              terms,
            },
          },
        },
      },
      include: {
        settings: true, // Include the settings in the response
      },
    });

    res.status(200).json({ message: "Settings updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during settings update" });
  }
};

export const uploadLogo = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const file = (req as Request & { file?: Express.Multer.File }).file;

  try {
    if (!file || !file.path) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { logoUrl: file.path },
    });

    res.status(200).json({
      logoUrl: updated.logoUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during logo upload" });
  }
};
