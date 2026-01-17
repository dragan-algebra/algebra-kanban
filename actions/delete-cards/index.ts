"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteCards } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let count;

  try {
    // 1. Check if the user actually owns the board/list to prevent malicious deletions
    const list = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    // 2. Delete all cards in this list
    const result = await db.card.deleteMany({
        where: {
            listId: id,
        },
    });
    
    count = result.count;

  } catch (error) {
    return {
      error: "Failed to delete cards."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: { count }, // Return how many were deleted
  };
};

export const deleteCards = createSafeAction(DeleteCards, handler);
