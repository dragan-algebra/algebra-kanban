"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteComment } from "./schema";
import { InputType, ReturnType } from "./types"; 
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, orgRole } = await auth(); 

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let comment;

  try {
    // Check if the comment exists and belongs to the user OR user is admin
    const commentToDelete = await db.comment.findUnique({
      where: { id },
    });

    if (!commentToDelete) {
      return { error: "Comment not found" };
    }

    // Permission Check:
    // 1. Are you the author?
    // 2. Are you an Admin of the current Org?
    const isAuthor = commentToDelete.userId === userId;
    const isAdmin = orgRole === "org:admin";

    if (!isAuthor && !isAdmin) {
       return { error: "Unauthorized. You can only delete your own comments." };
    }

    comment = await db.comment.delete({
      where: {
        id,
      },
    });

    await createAuditLog({
      entityId: comment.cardId,
      entityTitle: comment.content.substring(0, 20),
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    });

  } catch (error) {
    return {
      error: "Failed to delete comment."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: comment };
};

export const deleteComment = createSafeAction(DeleteComment, handler);
