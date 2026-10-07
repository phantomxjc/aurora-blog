import { Router } from "express";
import { prisma } from "../utils/db.js";
import { generateToken, hashPassword, verifyPassword } from "../utils/auth.js";
import { createCaptcha, verifyCaptcha } from "../utils/captcha.js";

const router = Router();

// Get captcha image
router.get("/captcha", (_req, res) => {
  const { id, image } = createCaptcha();
  res.json({ id, image });
});

// Helper: get a setting value
async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({ where: { configKey: key } });
  return setting?.value || null;
}

// Login
router.post("/login", async (req, res) => {
  const { username, password, captchaId, captchaCode } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "请输入用户名和密码" });
  }

  // Check if captcha is enabled
  const captchaEnabled = (await getSetting("captchaEnabled")) !== "false";
  if (captchaEnabled) {
    if (!captchaId || !captchaCode) {
      return res.status(400).json({ error: "请输入验证码" });
    }
    if (!verifyCaptcha(captchaId, captchaCode)) {
      return res.status(400).json({ error: "验证码错误或已过期" });
    }
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "用户名或密码错误" });
  }

  // Determine token expiration based on auto-logout settings
  const autoLogoutEnabled = (await getSetting("autoLogoutEnabled")) !== "false";
  const autoLogoutMinutes = parseInt((await getSetting("autoLogoutMinutes")) || "30", 10);
  const expiresIn = autoLogoutEnabled ? `${autoLogoutMinutes}m` : "7d";

  const token = generateToken(user.id, user.username, expiresIn);
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, role: user.role },
    autoLogout: autoLogoutEnabled ? autoLogoutMinutes * 60 : 0,
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
