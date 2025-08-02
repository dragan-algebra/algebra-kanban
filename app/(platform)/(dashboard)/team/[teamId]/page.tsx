import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";

const TeamIdPage = async () => {

  return (
    <div className="w-full mb-20">
        <Info />
        <Separator className="px-2 md:my-4" />
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>

    </div>
  );
};

export default TeamIdPage;
