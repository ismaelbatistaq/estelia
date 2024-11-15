import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import env from '../config/env';
import { AppError } from '../utils/error';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const organizationSlug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        slug: organizationSlug,
        users: {
          create: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: 'ADMIN',
          },
        },
      },
      include: {
        users: true,
      },
    });

    const user = organization.users[0];
    const token = jwt.sign(
      {
        userId: user.id,
        orgId: organization.id,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        orgId: user.organization.id,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Invalid refresh token', 401);
    }

    const token = jwt.sign(
      {
        userId: session.user.id,
        orgId: session.user.organization.id,
        role: session.user.role,
      },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      status: 'success',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await redis.set(`blacklist:${token}`, '1', 'EX', 900); // 15 minutes
    }

    res.json({
      status: 'success',
      message: 'Successfully logged out',
    });
  } catch (error) {
    next(error);
  }
};