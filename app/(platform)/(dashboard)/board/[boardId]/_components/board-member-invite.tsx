"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { addMember } from "@/actions/add-member";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export const BoardMemberInvite = () => {
  const params = useParams();
  const [email, setEmail] = useState("");

  const { execute, isLoading } = useAction(addMember, {
    onSuccess: (data) => {
      toast.success(`User added to board!`);
      setEmail("");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = () => {
    const boardId = params.boardId as string;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    execute({ email, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="ml-2 bg-white text-neutral-800 hover:bg-[#e27526] hover:text-white transition-colors border-none shadow-sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 pt-3" align="end" side="bottom">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Invite to Board
        </div>
        <div className="flex flex-col gap-y-4">
          <Input 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={onSubmit} 
            disabled={isLoading || !email}
            className="w-full bg-[#c40f61] hover:bg-[#e27526]"
            variant="primary"
          >
            Add Member
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
