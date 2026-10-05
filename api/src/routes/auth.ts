import { Router } from "express";
import { prisma } from "../utils/db.js";
import { generateToken, hashPassword, verifyPassword } from "../utils/auth.js";

const router = Router();

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "请输入用户名和密码" });
  }
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "用户名或密码错误" });
  }
  const token = generateToken(user.id, user.username);
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, role: user.role },
  });
});

// Get current user
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "未授权" });
  }
  const jwt = (await import("jsonwebtoken")).default;
  try {
    const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "aurora-default-secret") as any;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(404).json({ error: "用户不存在" });
    res.json({ id: user.id, username: user.username, email: user.email, avatar: user.avatar, role: user.role });
  } catch {
    res.status(401).json({ error: "Token 无效" });
  }
});

// Change password
router.post("/change-password", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "未授权" });
  const jwt = (await import("jsonwebtoken")).default;
  try {
    const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "aurora-default-secret") as any;
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !verifyPassword(oldPassword, user.passwordHash)) {
      return res.status(400).json({ error: "原密码错误" });
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(newPassword) } });
    res.json({ message: "密码修改成功" });
  } catch {
    res.status(401).json({ error: "Token 无效" });
  }
});

export default router;
