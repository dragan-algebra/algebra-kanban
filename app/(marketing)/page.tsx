import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className={cn(
        "flex items-center justify-center flex-col",
      )}>
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-blue-50 text-blue-700 rounded-full uppercase">
          <GraduationCap className="h-6 w-6 mr-2" />
          Collaborate & Track Progress
        </div>
        <h1 className="text-3xl md:text-6xl bg-linear-to-r from-[#004890] to-[#ea4f3c] text-transparent bg-clip-text font-bold px-4 p-2 rounded-md pb-4 w-fit">
          Deliver Projects On Time
        </h1>
      </div>
      <div className={cn(
        "text-sm md:text-xl text-[#141617]-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
      )}>
        Collaborate with your team, manage assignments, and track progress. 
        The official platform for Algebra students to deliver projects on time.
      </div>
      <Button className="mt-6 bg-[#c40f61] hover:bg-[#e27526]" size="lg" asChild>
        <Link href="/sign-in">
          Login with your Algebra email
        </Link>
      </Button>
    </div>
  );
};

export default MarketingPage;
