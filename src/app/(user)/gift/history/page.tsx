"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function History() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { setIsLoading } = useAuth();
    const getTransactions = async () => {
        try {
            const response = await axiosPrivate.get(
                "/api/v1/users/coins/transactions"
            );
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-5">
                <IoIosArrowBack size={30} onClick={() => router.back()} />
            </div>
            <h1 className="mb-5 text-3xl font-bold">Transaction Histories</h1>
            <div className="flex flex-col gap-0">
                {transactions.map((transaction, index) => (
                    <div
                        key={index}
                        className="flex flex-row gap-5 px-5 py-3 rounded-lg items-center hover:bg-gray-800 cursor-pointer"
                        onClick={() => router.push(transaction.path || "")}
                    >
                        <div className="flex flex-col">
                            <h1 className="font-semibold text-lg">
                                {transaction?.type}
                            </h1>
                            <p>
                                {transaction?.moneyAmount +
                                    transaction?.transactionFee}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {transaction?.createdAt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
