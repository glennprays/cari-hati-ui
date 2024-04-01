"use client";

import { useAuth } from "@/contexts/auth";
import axios from "@/utils/requester/AxiosProvider";
import { useEffect, useState } from "react";

export default function Home() {
    const { logout } = useAuth();
    const [account, setAccount] = useState<any>();
    const { identity } = useAuth();

    useEffect(() => {
        const getAccount = async () => {
            try {
                const response = await axios.get("/api/v1/auth/account");
                setAccount(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAccount();
    }, []);
    return (
        <>
            Success Login
            <br />
            <button onClick={logout}>Logout</button>
            <br />
            <p>{account && account.id}</p>
            <p>{JSON.stringify(identity)}</p>
        </>
    );
}
