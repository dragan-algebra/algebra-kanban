"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { AddMember } from "./schema";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { email, boardId } = data;

  try {
    // 1. Find the user by email
    const userToAdd = await db.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return { error: "User not found. Ask them to log in to the app first." };
    }

    // 2. Add user to the board
    await db.board.update({
      where: {
        id: boardId,
        orgId,
      },
      data: {
        members: {
          connect: { id: userToAdd.id },
        },
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { data: userToAdd };
  } catch (error) {
    return { error: "Failed to add member." };
  }
};

export const addMember = createSafeAction(AddMember, handler);
