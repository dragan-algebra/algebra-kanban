"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog, Comment } from "@prisma/client";
import { Trash, MessageSquare, Activity as ActivityIcon } from "lucide-react";
import { useRef } from "react";
import { useAction } from "@/hooks/use-action";
import { createComment } from "@/actions/create-comment";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { ActivityItem } from "@/components/activity-item";
import { deleteComment } from "@/actions/delete-comment";

interface CommentsAndActivityProps {
  items: AuditLog[];
  cardId: string;
  comments?: Comment[];
}

export const CommentsAndActivity = ({ 
  items, 
  cardId, 
  comments = [] 
}: CommentsAndActivityProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { execute, fieldErrors } = useAction(createComment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card-comments", data.cardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.cardId], 
      });
      toast.success("Comment added");
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const content = formData.get("content") as string;
    const boardId = params.boardId as string;

    execute({ content, boardId, cardId });
  };

  const { execute: executeDelete, isLoading: isDeleting } = useAction(deleteComment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card-comments", data.cardId],
      });
      toast.success("Comment deleted");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (commentId: string) => {
    const boardId =  params.boardId as string;
    executeDelete({ id: commentId, boardId });
  };

  return (
    <div className="w-full space-y-8">
        
        {/* --- COMMENTS SECTION --- */}
        <div className="flex items-start gap-x-3 w-full">
            <MessageSquare className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Comments</p>
                
                {/* Comment Input */}
                <div className="flex items-start gap-x-3 mb-4">
                     <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>U</AvatarFallback>
                     </Avatar>
                     <div className="w-full">
                        <form action={onSubmit}>
                            <FormTextarea
                                id="content"
                                ref={textareaRef}
                                className="w-full"
                                placeholder="Write a comment..."
                                errors={fieldErrors}
                            />
                            <div className="mt-2">
                                <Button size="sm" className="bg-[#c40f61] hover:bg-[#e27526]">
                                    Save
                                </Button>
                            </div>
                        </form>
                     </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4 mt-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-x-3 w-full group">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.userImage || ""} />
                                <AvatarFallback>{comment.userName?.[0]}</AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col space-y-0.5 w-full">
                                 <div className="text-sm flex items-center justify-between">
                                  <div>
                                     <span className="font-semibold text-neutral-700 mr-2">{comment.userName}</span>
                                     <span className="text-xs text-muted-foreground">
                                       {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </span>
                                  </div>
                                  {(user?.id === comment.userId) && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-600"
                                      disabled={isDeleting}
                                      onClick={() => onDelete(comment.id)}
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  )}
                                 </div>
                                 <p className="text-sm text-neutral-700 bg-white p-2 rounded-md border shadow-sm">
                                    {comment.content}
                                 </p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- ACTIVITY SECTION --- */}
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Activity</p>
                <ol className="mt-2 space-y-4">
                {items.map((item) => (
                    <ActivityItem key={item.id} data={item} />
                ))}
                </ol>
            </div>
        </div>
    </div>
  );
};

CommentsAndActivity.Skeleton = function CommentsAndActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="bg-neutral-200 h-6 w-6" />
      <div className="w-full">
        <Skeleton className="bg-neutral-200 w-24 h-6 mb-2" />
        <Skeleton className="bg-neutral-200 w-full h-10" />
      </div>
    </div>
  );
};
