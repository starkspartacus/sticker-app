import { db } from "@/db";

export async function createUser({ id, email }: { id: string; email: string }) {
  try {
    const user = await db.user.upsert({
      where: { id },
      create: {
        id,
        email,
      },
      update: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
