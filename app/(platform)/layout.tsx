import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { syncUser } from "@/lib/sync-users";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const PlatformLayout = async ({ children }: { children: React.ReactNode }) => {
    await syncUser();
    
    return (
        <ClerkProvider>
            <QueryProvider>
                <Toaster />
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    );
};

export default PlatformLayout;