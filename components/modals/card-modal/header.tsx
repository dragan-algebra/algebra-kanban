"use client";

import { useRef, useState } from "react";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormInput } from "@/components/form/form-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (title === data.title) {
      return;
    }

    execute({
      title,
      boardId,
      id: data.id,
    });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>

        {/* Members & Labels Section */}
        <div className="flex items-start gap-x-8 mt-4">
          
          {/* Members */}
          {data.members && data.members.length > 0 && (
            <div className="flex flex-col gap-y-1">
              <p className="text-xs font-semibold text-neutral-700">
                Members
              </p>
              <div className="flex -space-x-1.5 overflow-hidden">
                {data.members.map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-7 w-7 border-2 border-white cursor-pointer hover:opacity-75 transition"
                  >
                    <AvatarImage src={member.image || ""} />
                    <AvatarFallback className="text-[10px]">
                      {member.name?.[0] || "M"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          )}

          {/* Labels */}
          {data.labels && data.labels.length > 0 && (
            <div className="flex flex-col gap-y-1">
              <p className="text-xs font-semibold text-neutral-700">
                Labels
              </p>
              <div className="flex flex-wrap gap-2">
                {data.labels.map((label) => (
                  <div
                    key={label.id}
                    className="text-xs font-medium px-2.5 py-1 rounded-sm text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
