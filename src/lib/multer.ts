// src/lib/multer.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "invoice-app/logos",
    format: "png",
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  }),
});

const upload = multer({ storage });

export default upload;
