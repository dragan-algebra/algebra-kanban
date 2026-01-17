"use client";

import { List } from "@prisma/client";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
    data: List;
    onAddCard: () => void;
};

export const ListHeader = ({
    data,
    onAddCard,
}: ListHeaderProps) => {
    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start- gap-x-2">
            <div className="w-full text-sm px-2.5 py-1 h-7 font-semibold border-transparent truncate bg-transparent">
                {data.title}
            </div>
            <ListOptions onAddCard={onAddCard} data={data} />
        </div>
    );
};

