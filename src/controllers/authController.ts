import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { env } from "process";

const JWT_SECRET = env.JWT_SECRET!;

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company: "",
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    const isProduction = env.FRONTEND_URL?.includes("https://");
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: isProduction ? undefined : "localhost",
    }); // 7 days

    res.status(201).json({
      user: { id: user.id, email: user.email, company: user.company },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    const isProduction = env.FRONTEND_URL?.includes("https://");
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: isProduction ? undefined : "localhost",
    }); // 7 days

    res.json({
      user: { id: user.id, email: user.email, company: user.company },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
    next(err);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const isProduction = env.FRONTEND_URL?.includes("https://");
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: isProduction ? "none" : "lax",
      domain: isProduction ? undefined : "localhost",
    });

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};
