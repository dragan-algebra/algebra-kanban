import { Card, List, Label } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & {
  list: List;
  labels: Label[];
};
