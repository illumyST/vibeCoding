import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { AppError } from './errors';

const SALT_ROUNDS = 11;

export async function hashPassword(raw: string) {
  return bcrypt.hash(raw, SALT_ROUNDS);
}

export async function verifyPassword(raw: string, hash: string) {
  return bcrypt.compare(raw, hash);
}

export async function authenticate(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new AppError('AUTH_FAILED', '帳號或密碼錯誤', 401);
  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) throw new AppError('AUTH_FAILED', '帳號或密碼錯誤', 401);
  return admin;
}

export function createSessionCookie(adminId: number) {
  // 簡易 session，正式應用可改用 JWT/NextAuth
  return `session=${adminId}; Path=/; HttpOnly; SameSite=Lax`;
}

export function parseSessionCookie(cookieHeader?: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(/;\s*/);
  const sessionPart = parts.find(p => p.startsWith('session='));
  if (!sessionPart) return null;
  const value = sessionPart.split('=')[1];
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}
