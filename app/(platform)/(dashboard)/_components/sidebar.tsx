"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { NavItem, Team } from "./nav-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useLocalStorage } from "usehooks-ts";

interface SidebarProps {
  storageKey?: string;
};

export const Sidebar = ({
  storageKey = 'kanban-sidebar-state',
}: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>(storageKey, {});
  const { organization: activeTeam, isLoaded: isLoadedTeam } = useOrganization();
  const { userMemberships, isLoaded: isLoadedTeamList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
});

const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
  (acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key);
    }

    return acc;
  },
  []
);

const onExpand = (id: string) => {
  setExpanded((curr) => ({
    ...curr,
    [id]: !expanded[id],
  }));
};

if (!isLoadedTeam || !isLoadedTeamList || userMemberships.isLoading) {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-10 w-[50%]" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <NavItem.Skeleton />
        <NavItem.Skeleton />
        <NavItem.Skeleton />
      </div>
    </>
  );
};

return (
  <>
    <div className="font-medium text-xs flex items-center mb-1">
      <span className="pl-4">Workspaces</span>
      <Button
        asChild
        type="button"
        size="icon"
        variant="ghost"
        className="ml-auto"
      >
      <Link href="/select-team">
        <Plus className="h-4 w-4" />
      </Link>
      </Button>
    </div>
    <Accordion 
      type="multiple"
      defaultValue={defaultAccordionValue}
      className="space-y-2"
    >
    {userMemberships.data.map(({ organization }) => (
      <NavItem 
        key={organization.id}
        isActive={activeTeam?.id === organization.id}
        isExpanded={expanded[organization.id]}
        team={organization as Team}
        onExpand={onExpand}
      />
    ))}
    </Accordion>
  </>
  );
};
