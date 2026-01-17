"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, User } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CardMembersProps {
  data: CardWithList;
}

export const CardMembers = ({ data }: CardMembersProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success("Card members updated");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { data: boardMembers, isLoading } = useQuery({
    queryKey: ["board-members", params.boardId],
    queryFn: () => fetcher(`/api/boards/${params.boardId}/members`),
  });

  const onToggleMember = (memberId: string) => {
    const currentMemberIds = data.members?.map((m) => m.id) || [];
    let newMemberIds;

    if (currentMemberIds.includes(memberId)) {
      newMemberIds = currentMemberIds.filter((id) => id !== memberId);
    } else {
      newMemberIds = [...currentMemberIds, memberId];
    }

    execute({
      id: data.id,
      boardId: params.boardId as string,
      members: newMemberIds,
    });
  };

  if (isLoading) {
    return (
        <div className="p-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="text-xs font-semibold text-neutral-700 mb-2">
        Board Members
      </div>
      <div className="space-y-1">
        {boardMembers?.map((member: any) => {
            const isActive = data.members?.some((m) => m.id === member.id);
            
            return (
                <div
                    key={member.id}
                    onClick={() => onToggleMember(member.id)}
                    className={cn(
                        "flex items-center gap-x-2 p-2 hover:bg-neutral-100 rounded-md cursor-pointer transition",
                        isActive && "bg-neutral-100/50"
                    )}
                >
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={member.image} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-neutral-700">{member.name}</span>
                    {isActive && (
                        <Check className="h-4 w-4 ml-auto text-neutral-700" />
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};
