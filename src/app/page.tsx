"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import useRefreshToken from "@/utils/hooks/useRefreshToken";
import { useEffect, useState } from "react";

export default function Home() {
    const { logout, identity } = useAuth();
    const [account, setAccount] = useState<any>();

    const refresh = useRefreshToken();

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getAccount = async () => {
            try {
                console.log("get account");
                const response = await axiosPrivate.get("/api/v1/auth/account");
                setAccount(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAccount();
    }, [axiosPrivate]);
    return (
        <>
            Success Login
            <br />
            <button onClick={logout}>Logout</button>
            <br />
            <p>{account && account.id}</p>
            <p>{JSON.stringify(identity)}</p>
            <button onClick={() => refresh()}>Refresh</button>
        </>
    );
}
