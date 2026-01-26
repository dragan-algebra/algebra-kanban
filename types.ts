import { Card, List, Label, User } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & {
  list: List;
  labels: Label[];
  members: User[];
};
