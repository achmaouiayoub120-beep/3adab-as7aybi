import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils';
import { signToken } from '../utils/jwt.utils';

export const authService = {
  async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw Object.assign(new Error('Un compte avec cet email existe déjà.'), { statusCode: 400 });

    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw Object.assign(new Error('Email ou mot de passe incorrect.'), { statusCode: 401 });

    const valid = await comparePassword(password, user.password);
    if (!valid) throw Object.assign(new Error('Email ou mot de passe incorrect.'), { statusCode: 401 });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async me(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, createdAt: true,
      },
    });
  },

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
    });
  },
};
