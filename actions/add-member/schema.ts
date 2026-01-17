import { z } from "zod";

export const AddMember = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  boardId: z.string(),
});
