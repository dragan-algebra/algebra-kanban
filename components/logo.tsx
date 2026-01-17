import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2
            hidden md:flex">
                <Image 
                    src="/logo.svg"
                    alt="Logo"
                    height={30}
                    width={48}
                />
                <p className="text-lg text-white font-semibold">
                    KanbanAlgebra
                </p>
            </div>
        </Link>
    )
}