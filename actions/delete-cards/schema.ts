import { z } from "zod";

export const DeleteCards = z.object({
  id: z.string(),
  boardId: z.string(),
});
