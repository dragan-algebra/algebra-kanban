import { z } from "zod";

export const CreateComment = z.object({
  content: z.string().min(1, {
    message: "Comment is too short",
  }),
  cardId: z.string(),
  boardId: z.string(),
});
