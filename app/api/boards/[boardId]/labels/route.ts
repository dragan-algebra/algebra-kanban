import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    const { boardId } = await params;

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
      return new NextResponse("Unauthorized or Not Found", { status: 404 });
    }

    const labels = await db.label.findMany({
      where: {
        boardId,
      },
    });

    return NextResponse.json(labels);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
