"use server";

import { auth } from "@clerk/nextjs/server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

    if (orgRole !== "org:admin") {
    return {
      error: "Only admins can create boards",
    };
  }

  const { title, image } = data;

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName
  ] = image.split("|");

  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: "Missing fields. Failed to create board."
    };
  }

  let board;

  try {
    // 1. Create the Board
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
        members: {
          connect: { id: userId }
        }
      }
    });

    // 2. Create Default Labels for this Board (Green, Yellow, Orange, Red, Purple, Blue)
    await db.label.createMany({
        data: [
            { title: "Done", color: "#4bce97", boardId: board.id },       // Green
            { title: "Priority", color: "#f5cd47", boardId: board.id },   // Yellow
            { title: "Warning", color: "#fea362", boardId: board.id },    // Orange
            { title: "Urgent", color: "#f87168", boardId: board.id },     // Red
            { title: "Bug", color: "#9f8fef", boardId: board.id },        // Purple
            { title: "Info", color: "#579dff", boardId: board.id },       // Blue
        ]
    });

    // 3. Create Audit Log
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });

  } catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);