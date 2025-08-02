import { startCase } from "lodash";
import { Sidebar } from "../_components/sidebar";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
    const { orgSlug } = await auth();

    return {
        title: startCase(orgSlug || "team"),
    };
};

const TeamIdLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block">
                    <Sidebar />
                </div>
                {children}
            </div>
        </main>
    );
};

export default TeamIdLayout;