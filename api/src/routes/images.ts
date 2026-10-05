import { Router } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../utils/auth.js";
import { upload } from "../utils/upload.js";

const router = Router();

// List images
router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 30;
  const [total, images] = await Promise.all([
    prisma.image.count(),
    prisma.image.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
  ]);
  res.json({ total, data: images });
});

// Upload image
router.post("/upload", requireAuth, upload.array("images", 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) return res.status(400).json({ error: "请选择图片" });
  const images = await Promise.all(
    files.map((file) =>
      prisma.image.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${file.filename}`,
        },
      })
    )
  );
  res.json({ data: images });
});

// Delete image
router.delete("/:id", requireAuth, async (req, res) => {
  const image = await prisma.image.findUnique({ where: { id: Number(req.params.id) } });
  if (!image) return res.status(404).json({ error: "图片不存在" });
  // Delete file from disk
  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.resolve("uploads", image.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await prisma.image.delete({ where: { id: image.id } });
  res.json({ message: "图片已删除" });
});

export default router;
