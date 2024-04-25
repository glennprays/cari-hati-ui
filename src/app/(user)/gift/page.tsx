"use client";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCoin } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";

export default function Gift() {
    const [coins, setCoins] = useState<number>(0);
    const axiosPrivate = useAxiosPrivate();
    const getCoinsAmount = async () => {
        try {
            const response = await axiosPrivate.get(
                "/api/v1/users/coins"
            );
            setCoins(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getCoinsAmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="px-6 py-6">
            <h1 className="mb-5 text-3xl font-bold">Gifts & Coins</h1>
            <div className="flex justify-between items-center px-6 py-4 bg-gray-700 rounded-3xl">
                <div className="flex gap-2">
                    <BsCoin size={20} /> <p>{coins}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/gift/topup" className="bg-pink-1 rounded-lg p-2 flex items-center justify-center">
                        Topup
                    </Link>
                    <Link href="/gift/withdraw" className="bg-pink-1 rounded-lg p-2 flex items-center justify-center">
                        Withdraw
                    </Link>
                    <Link href="/gift/history" className="bg-pink-1 rounded-lg p-2 flex items-center justify-center">
                        History
                    </Link>
                </div>
            </div>
        </div>
    );
}
