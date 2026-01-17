"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@prisma/client";

import { fetcher } from "@/lib/fetcher";
import { useCardModal } from "@/hooks/use-card-modal";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { CardActions } from "./card-actions-bar";
import { CommentsAndActivity } from "./comments-and-activity";
import { Comment } from "@prisma/client";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
  });

  const { data: auditLogsData } = useQuery({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id,
    refetchInterval: 2000,
  });

  const { data: commentsData } = useQuery<Comment[]>({
    queryKey: ["card-comments", id],
    queryFn: () => fetcher(`/api/cards/${id}/comments`),
    enabled: !!id,
    refetchInterval: 2000,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl! w-full p-0 overflow-hidden">
        <DialogDescription className="sr-only">Card Details Modal</DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] h-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {/* Left: content */}
          <div className="p-6 space-y-8">
            {!cardData ? (
              <>
                <Header.Skeleton />
                <CardActions.Skeleton />
                <div className="mt-6">
                  <Description.Skeleton />
                </div>
              </>
            ) : (
              <>
                <Header data={cardData} />
                <CardActions data={cardData} />
                <div className="mt-6">
                  <Description data={cardData} />
                </div>
              </>
            )}
          </div>

          <aside className="border-l bg-neutral-50/50 p-6 flex flex-col gap-6">
            {!auditLogsData || !cardData || !commentsData ? (
              <CommentsAndActivity.Skeleton />
            ) : (
              <CommentsAndActivity
                cardId={cardData.id}
                items={auditLogsData as AuditLog[]}
                comments={commentsData}            
              />
            )}
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};
