"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function removeMember(boardId: string, memberId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }


  try {
    await db.board.update({
      where: {
        id: boardId,
        orgId,
      },
      data: {
        members: {
          disconnect: {
            id: memberId // Disconnects this specific User
          }
        }
      }
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to remove member" };
  }
}
