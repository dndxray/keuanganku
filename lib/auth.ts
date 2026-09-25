import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const userIdFromCookie =
    cookieStore.get("userId")?.value ||
    cookieStore.get("session_user")?.value ||
    cookieStore.get("session_token")?.value;

  const userIdFromHeader = headerStore.get("x-user-id");
  const targetId = userIdFromCookie || userIdFromHeader;

  if (targetId) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: targetId },
        select: { id: true, name: true, email: true },
      });
      if (existingUser) {
        return existingUser;
      }
    } catch {
      // Fallback jika database belum aktif
    }
  }

  try {
    const firstUser = await prisma.user.findFirst({
      select: { id: true, name: true, email: true },
    });
    if (firstUser) {
      return firstUser;
    }

    const newUser = await prisma.user.create({
      data: {
        name: "Princess",
        email: "princess@keuanganku.app",
        passwordHash: "$2a$12$secureDemoHashedPassword12345",
      },
      select: { id: true, name: true, email: true },
    });

    return newUser;
  } catch {
    return {
      id: "user-default-01",
      name: "Princess",
      email: "princess@keuanganku.app",
    };
  }
}
