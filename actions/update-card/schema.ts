import { z } from "zod";

export const UpdateCard = z.object({
  boardId: z.string(),
  id: z.string(),

  title: z.string()
    .min(3, { message: "Title is too short" })
    .optional(),

  description: z.string()
    .min(3, { message: "Description is too short." })
    .optional(),
});
