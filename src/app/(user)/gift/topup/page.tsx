"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function Topup() {
    const router = useRouter();
    const [coinPackages, setCoinPackages] = useState<any[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const [selectedCoinPackage, setSelectedCoinPackage] = useState<any>(null);
    const { setIsLoading } = useAuth();
    const [response, setResponse] = useState<any>(null);

    const getCoinPackages = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/coins/packages");
            setCoinPackages(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTopup = async () => {
        try {
            setIsLoading(true);
            if (selectedCoinPackage) {
                const response = await axiosPrivate.post(
                    "/api/v1/coins/topup",
                    {
                        bank_code: "BCA",
                        coin_package_id: selectedCoinPackage.id,
                    }
                );
                setResponse(response.data);
                // router.push(`/gift/topup/${response.data.id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getCoinPackages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-5">
                <IoIosArrowBack size={30} onClick={() => router.back()} />
            </div>
            <h1 className="mb-5 text-3xl font-bold">Top Up Coin</h1>
            {!response ? (
                <>
                    <div className="flex flex-col gap-5">
                        {coinPackages.map((coinPackage, index) => (
                            <div
                                onClick={() =>
                                    setSelectedCoinPackage(coinPackage)
                                }
                                key={coinPackage.id}
                                className={`flex flex-row gap-5 px-5 py-3 rounded-lg items-center hover:bg-gray-700 cursor-pointer ${
                                    coinPackage.id === selectedCoinPackage?.id
                                        ? "bg-gray-700"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-center w-14 h-14 rounded-full text-white">
                                    {coinPackage.coinAmount}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm text-gray-400">
                                        Price
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {coinPackage.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-10">
                        <Button
                            className="bg-pink-1 hover:bg-pink-2 text-xl font-medium px-28"
                            radius="full"
                            type="submit"
                            onClick={handleTopup}
                        >
                            Topup Coin
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col justify-center mt-10">
                    <p className="font-semibold text-2xl">
                        Virtual Account Number: {response.bankAccountNumber}
                    </p>
                    <p className="font-semibold text-2xl">
                        Total Payment:{" "}
                        {response.moneyAmount + response.transactionFee}
                    </p>
                    <div className="mt-6">
                        <p className="text-lg">Details</p>
                        <p>Coin Amount: {response.coinAmount}</p>
                        <p>Money Amount: {response.moneyAmount}</p>
                        <p>Transaction Fee: {response.transactionFee}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
