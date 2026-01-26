"use client";

import { User } from "@prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { removeMember } from "@/actions/remove-member"; 

interface BoardMembersProps {
  data: User[];
  boardId: string;
}

export const BoardMembers = ({ data, boardId }: BoardMembersProps) => {
  const router = useRouter();

  const onRemove = async (memberId: string) => {
    const result = await removeMember(boardId, memberId);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Member removed");
      router.refresh();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center -space-x-2 overflow-hidden hover:opacity-75 cursor-pointer mr-4">
            {data.slice(0, 4).map((user) => (
                <Avatar key={user.id} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
            ))}
            {data.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                    +{data.length - 4}
                </div>
            )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board members
        </div>
        <div className="flex flex-col gap-y-1 px-4 max-h-[300px] overflow-y-auto">
            {data.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-x-2 py-1">
                    <div className="flex items-center gap-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-xs text-neutral-500">{user.email}</span>
                        </div>
                    </div>
                    <Button 
                        onClick={() => onRemove(user.id)}
                        variant="ghost" 
                        size="sm"
                        className="h-auto w-auto p-1 text-neutral-500 hover:text-red-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
