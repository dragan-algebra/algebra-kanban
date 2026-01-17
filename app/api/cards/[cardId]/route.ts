import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { cardId } = resolvedParams;
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const card = await db.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        list: {
          select: {
            title: true,
            board: {
              include: { members: true }
            }
          },
        },
        labels: true,
        members: true,
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Custom Permission Check
    const board = card.list.board;
    const hasAccess = board.orgId === orgId || board.members.some(m => m.id === userId);

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
