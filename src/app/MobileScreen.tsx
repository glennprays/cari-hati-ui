import React from "react";

export default function MobileScreen({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="dark bg-primary w-full min-h-screen mx-auto max-w-[448px] min-[448px]:border min-[480px]:border-gray-800 z-[1] shadow-[#242424] shadow-lg">
            {children}
        </main>
    );
}
