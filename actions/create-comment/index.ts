"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateComment } from "./schema";
import { InputType, ReturnType } from "./types";
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const dbUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    return {
      error: "User not found. Try refreshing the page.",
    };
  }

  const { content, cardId, boardId } = data;
  let comment;

  try {
    comment = await db.comment.create({
      data: {
        content,
        cardId,
        userId,
        userImage: dbUser.image || "", 
        userName: dbUser.name || "Anonymous", 
      },
    });

    await createAuditLog({
      entityId: cardId,
      entityTitle: comment.content.substring(0, 20),
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to create comment.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: comment };
};

export const createComment = createSafeAction(CreateComment, handler);
