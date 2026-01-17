"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { id, boardId, labels, members, ...values } = data;

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      OR: [
        { orgId }, 
        { members: { some: { id: userId } } }
      ]
    }
  });

  if (!board) {
    return { error: "Unauthorized" };
  }

  let card;

  try {
    const labelUpdate = labels
      ? {
          labels: {
            set: labels.map((labelId) => ({ id: labelId })),
          },
        }
      : {};
      
    const membersUpdate = members 
      ? {
          members: {
            set: members.map((memberId) => ({ id: memberId })),
          }
      } 
      : {};

    card = await db.card.update({
      where: {
        id,
        list: { boardId },
      },
      data: {
        ...values,
        ...labelUpdate,
        ...membersUpdate, 
      },
      include: {
        labels: true,
      },
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return { error: "Failed to update." };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
