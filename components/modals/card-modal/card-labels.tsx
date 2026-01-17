"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tag, Check } from "lucide-react";
import { Label } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query"; 
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


interface CardLabelsProps {
  data: CardWithList;
}

export const CardLabels = ({ data }: CardLabelsProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCard, {
    onSuccess: (updateCard) => {
      queryClient.invalidateQueries({
        queryKey: ["card", updateCard.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", updateCard.id]
      });

      toast.success("Labels updated");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Fetch all labels available for this board
  const { data: boardLabels } = useQuery<Label[]>({
    queryKey: ["board-labels", params.boardId],
    queryFn: () => fetcher(`/api/boards/${params.boardId}/labels`),
  });

  const onToggleLabel = (labelId: string) => {
    const currentLabelIds = data.labels.map((l) => l.id);
    let newLabelIds = [];

    if (currentLabelIds.includes(labelId)) {
      // Remove
      newLabelIds = currentLabelIds.filter((id) => id !== labelId);
    } else {
      // Add
      newLabelIds = [...currentLabelIds, labelId];
    }

    execute({
      id: data.id,
      boardId: params.boardId as string,
      labels: newLabelIds,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-3"
        >
          <Tag className="h-4 w-4 mr-2" />
          Labels
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="text-sm font-medium text-center pb-4 text-neutral-600">
          Labels
        </div>
        <div className="space-y-1">
            {!boardLabels ? (
                <div className="text-xs text-center text-muted-foreground">Loading...</div>
            ) : boardLabels.map((label) => {
                const isActive = data.labels.some((l) => l.id === label.id);
                return (
                    <div
                        key={label.id}
                        onClick={() => onToggleLabel(label.id)}
                        className={cn(
                            "w-full h-8 rounded-sm px-2 hover:opacity-75 transition cursor-pointer flex items-center justify-between font-medium text-xs text-white",
                            // We use the hex color from DB, or a fallback class
                        )}
                        style={{ backgroundColor: label.color }}
                    >
                        {label.title}
                        {isActive && <Check className="h-3 w-3" />}
                    </div>
                );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
