"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import useRefreshToken from "@/utils/hooks/useRefreshToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { logout, identity, accessToken, isUserActivated } = useAuth();
    const [account, setAccount] = useState<any>();

    const refresh = useRefreshToken();

    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();

    const getAccount = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/auth/account");
            setAccount(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (accessToken !== "") {
            getAccount();
            if (!isUserActivated) {
                router.push("/activation");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);
    return (
        <div suppressHydrationWarning>
            <div suppressHydrationWarning>
                Success Login
                <br />
                <div onClick={logout}>Logout</div>
                <br />
                <p>{account && account.id}</p>
                <p>{JSON.stringify(identity)}</p>
                <div onClick={() => refresh()}>Refresh</div>
            </div>
        </div>
    );
}
