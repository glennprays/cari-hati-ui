"use client";
import { Navbar } from "@/components/element/navbar";
import useAuth from "@/utils/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { usePathname } from "next/navigation";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, identity, accessToken } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (accessToken === "") {
            router.replace("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    const pathname = usePathname();

    const showNavbarRoutes = [
        "/home",
        "/chat",
        "/notification",
        "/gift",
        "/settings",
    ];
    return (
        <div className="w-full pb-[20px]">
            {children}
            {showNavbarRoutes.includes(pathname) && <Navbar />}
        </div>
    );
}
