import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE =
  "expense_session";

const SESSION_DURATION =
  7 * 24 * 60 * 60 * 1000;

export async function createSession(
  userId: number
) {
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION
  );

  const session =
    await prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });

  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    session.id,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    }
  );

  return session;
}

export async function getSession() {
  const cookieStore =
    await cookies();

  const sessionId =
    cookieStore.get(
      SESSION_COOKIE
    )?.value;

  if (!sessionId) {
    return null;
  }

  const session =
    await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

  if (!session) {
    cookieStore.delete(
      SESSION_COOKIE
    );

    return null;
  }

  if (
    session.expiresAt <=
    new Date()
  ) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    cookieStore.delete(
      SESSION_COOKIE
    );

    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session =
    await getSession();

  if (!session) {
    return null;
  }

  return session.user;
}

export async function destroySession() {
  const cookieStore =
    await cookies();

  const sessionId =
    cookieStore.get(
      SESSION_COOKIE
    )?.value;

  if (sessionId) {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
  }

  cookieStore.delete(
    SESSION_COOKIE
  );
}