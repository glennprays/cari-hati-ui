"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import useRefreshToken from "@/utils/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import StartPage from "./_sections/start";
import { useRouter } from "next/navigation";

export default function Home() {
    const { accessToken } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (accessToken) {
            router.replace("/home");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);
    return (
        <div suppressHydrationWarning>
            <StartPage />
        </div>
    );
}
