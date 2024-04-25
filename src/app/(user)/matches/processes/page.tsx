"use client";
import { calculateAge, formatDate } from "@/utils/date/data.util";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Processes() {
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();
    const { identity, setIsLoading } = useAuth();
    const [incoming, setIncoming] = useState<any[]>([]);
    const [pending, setPending] = useState<any[]>([]);

    const getMatches = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/users/matches");
            const incoming = response.data.filter(
                (match: any) =>
                    match.status === "pending" &&
                    match.receiver.id === identity?.id
            );
            const pending = response.data.filter(
                (match: any) =>
                    match.status === "pending" &&
                    match.sender.id === identity?.id
            );
            setIncoming(incoming);
            setPending(pending);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getMatches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="py-6 px-6">
            <div className="flex justify-between items-center mb-5">
                <IoIosArrowBack size={30} onClick={() => router.back()} />
            </div>
            <div className="mb-5">
                <h1 className="font-semibold text-2xl">
                    Incoming Match Request
                </h1>
                {incoming.length === 0 && (
                    <p>No incoming match request available.</p>
                )}
                <div className="flex flex-col gap-2 mt-5">
                    {incoming.map((match, index) => (
                        <Link
                            href={`/matches/${match.id}`}
                            key={match.id + index}
                            className="flex justify-between items-center cursor-pointer"
                        >
                            <div className="px-0 py-2 rounded-lg shadow-md flex items-center gap-4">
                                <Avatar
                                    showFallback
                                    src={match.sender.photoProfile?.path}
                                    className="w-14 h-14"
                                />
                                <div>
                                    <p className="text-xl">
                                        {match.sender.name.split(" ")[0]},{" "}
                                        {calculateAge(match.sender.birth)}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Requested on{" "}
                                        {formatDate(match.updatedAt)}
                                    </p>
                                </div>
                            </div>
                            <IoIosArrowForward size={30} />
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mb-5">
                <h1 className="font-semibold text-2xl">
                    Pending Match Request
                </h1>
                {pending.length === 0 && (
                    <p>No pending match request available.</p>
                )}
                <div className="flex flex-col gap-1 mt-5">
                    {pending.map((match, index) => (
                        <Link
                            href={`/matches/${match.id}`}
                            key={match.id + index}
                            className="flex justify-between items-center cursor-pointer"
                        >
                            <div className="px-0 py-2 rounded-lg shadow-md flex items-center gap-4">
                                <Avatar
                                    showFallback
                                    src={match.receiver.photoProfile?.path}
                                    className="w-14 h-14"
                                />
                                <div>
                                    <p className="text-xl">
                                        {match.receiver.name.split(" ")[0]},{" "}
                                        {calculateAge(match.receiver.birth)}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Requested on{" "}
                                        {formatDate(match.updatedAt)}
                                    </p>
                                </div>
                            </div>
                            <IoIosArrowForward size={30} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
