"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useParams } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";

interface CardDatePickerProps {
  data: CardWithList;
}

export const CardDatePicker = ({ data }: CardDatePickerProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(
    data.dueDate ? new Date(data.dueDate) : undefined
  );

  const { execute } = useAction(updateCard, {
    onSuccess: (updatedCard) => {
      queryClient.invalidateQueries({ queryKey: ["card", updatedCard.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", updatedCard.id] });
      toast.success("Due date updated");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      boardId,
      dueDate: selectedDate || null,
    });
  };

  const onRemoveDate = () => {
    setDate(undefined);
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      boardId,
      dueDate: null,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
   <Button
  type="button"
  variant={date ? "default" : "gray"} 
  size="inline" 
  className="w-auto gap-2 justify-start h-8 px-3"
>
          <Calendar className="h-4 w-4 mr-2" />
          {date ? format(date, "MMM dd, yyyy") : "Dates"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          initialFocus
        />
        {date && (
          <div className="p-3 border-t">
            <Button
              onClick={onRemoveDate}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Remove date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
