"use client";

import { useAuth } from "@/contexts/auth";

export default function Home() {
    const { logout } = useAuth();
    return (
        <>
            Success Login
            <br />
            <button onClick={logout}>Logout</button>
        </>
    );
}
