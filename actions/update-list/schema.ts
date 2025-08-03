import { z } from "zod";

export const UpdateList = z.object({
  title: z
    .string()
    .nonempty({ message: "Title is required" })
    .min(3, { message: "Title is too short" }),
  id: z.string(),
  boardId: z.string(),
});
