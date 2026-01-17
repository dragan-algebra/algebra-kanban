import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    const { cardId } = await params;

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Fetch card to check permissions
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: { list: { include: { board: { include: { members: true } } } } }
    });

    if (!card) return new NextResponse("Card not found", { status: 404 });

    // 2. Permission Check
    const board = card.list.board;
    const hasAccess = board.orgId === orgId || board.members.some(m => m.id === userId);

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // 3. Fetch Comments
    const comments = await db.comment.findMany({
      where: {
        cardId: cardId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
