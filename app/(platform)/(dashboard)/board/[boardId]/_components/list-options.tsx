"use client";

import { toast } from "sonner";
import { List } from "@prisma/client";
import { useRef, useState } from "react";
import { MoreHorizontal, X, ArrowLeft } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";

import { deleteList } from "@/actions/delete-list";
import { copyList } from "@/actions/copy-list";
import { updateList } from "@/actions/update-list";
import { deleteCards } from "@/actions/delete-cards"; 

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({
  data,
  onAddCard,
}: ListOptionsProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [view, setView] = useState<"default" | "rename">("default");

  const onOpenChange = (open: boolean) => {
    if (!open) setView("default");
  };

  // DELETE LIST Action
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeDelete({ id, boardId });
  };

  // DELETE ALL CARDS Action (New)
  const { execute: executeDeleteCards } = useAction(deleteCards, {
    onSuccess: (result) => {
      toast.success(`Deleted cards in list`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDeleteCards = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeDeleteCards({ id, boardId });
  };

  // COPY Action
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeCopy({ id, boardId });
  };

  // RENAME Action
  const { execute: executeRename, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      closeRef.current?.click();
      setView("default");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onRename = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeRename({ title, id, boardId });
  };

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            {view === "rename" ? "Rename list" : "List actions"}
        </div>
        
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        {view === "rename" && (
             <Button
             onClick={() => setView("default")}
             className="h-auto w-auto p-2 absolute top-2 left-2 text-neutral-600"
             variant="ghost"
           >
             <ArrowLeft className="h-4 w-4" />
           </Button>
        )}
        
        <Separator />

        {view === "default" && (
            <>
                <Button
                onClick={onAddCard}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                variant="ghost"
                >
                Add card...
                </Button>
                <Button
                onClick={() => setView("rename")}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                variant="ghost"
                >
                Rename list...
                </Button>
                <form action={onCopy}>
                <input hidden name="id" id="id" value={data.id} readOnly />
                <input hidden name="boardId" id="boardId" value={data.boardId} readOnly />
                <FormSubmit
                    variant="ghost"
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                >
                    Copy list...
                </FormSubmit>
                </form>
                
                <Separator />
                
                {/* NEW BUTTON: Delete all cards */}
                <form action={onDeleteCards}>
                <input hidden name="id" id="id" value={data.id} readOnly />
                <input hidden name="boardId" id="boardId" value={data.boardId} readOnly />
                <FormSubmit
                    variant="ghost"
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-600 hover:text-rose-600 hover:bg-rose-50"
                >
                    Delete all cards in this list
                </FormSubmit>
                </form>

                <form action={onDelete}>
                <input hidden name="id" id="id" value={data.id} readOnly />
                <input hidden name="boardId" id="boardId" value={data.boardId} readOnly />
                <FormSubmit
                    variant="ghost"
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-600 hover:text-rose-600 hover:bg-rose-50"
                >
                    Delete this list
                </FormSubmit>
                </form>
            </>
        )}

        {view === "rename" && (
             <form action={onRename} className="p-4 space-y-4">
                <input hidden name="id" id="id" value={data.id} readOnly />
                <input hidden name="boardId" id="boardId" value={data.boardId} readOnly />
                <FormInput 
                    id="title"
                    label="List title"
                    defaultValue={data.title}
                    className="h-8"
                    errors={fieldErrors}
                />
                <FormSubmit className="w-full h-8">
                    Save
                </FormSubmit>
             </form>
        )}

      </PopoverContent>
    </Popover>
  );
};
