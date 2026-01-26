"use client";

import { Copy, Trash, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import { toast } from "sonner";
import { CardLabels } from "./card-labels"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CardMembers } from "./card-members";
import { CardDatePicker } from "./card-date-picker";

interface CardActionsProps {
  data: CardWithList;
}

export const CardActions = ({ data }: CardActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" copied`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" deleted`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopy({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDelete({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold text-neutral-700 mb-1">
        Actions
      </p>
      
      <div className="flex flex-wrap gap-2">
        <CardLabels data={data} />
        <CardDatePicker data={data} />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="gray"
              className="w-auto gap-2 justify-start"
              size="inline"
            >
              <Users className="h-4 w-4" />
              Members
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 px-0 pt-3 pb-3" side="bottom" align="start">
            <CardMembers data={data} />
          </PopoverContent>
        </Popover>
        
        <Button
          onClick={onCopy}
          disabled={isLoadingCopy}
          variant="gray"
          className="w-auto gap-2 justify-start"
          size="inline"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          onClick={onDelete}
          disabled={isLoadingDelete}
          variant="gray"
          className="w-auto gap-1.5 justify-start"
          size="inline"
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

CardActions.Skeleton = function CardActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
