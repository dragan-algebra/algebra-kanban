import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteCards } from "./schema";

export type InputType = z.infer<typeof DeleteCards>;
export type ReturnType = ActionState<InputType, { count: number }>;
