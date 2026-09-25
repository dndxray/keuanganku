import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
    },
    });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function authenticateUser(
  email: string,
  password: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

  if (!user) {
    return null;
  }

  const passwordValid =
    await bcrypt.compare(
        password,
        user.passwordHash
    );

  if (!passwordValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}