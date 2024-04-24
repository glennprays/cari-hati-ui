"use client";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillInboxesFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import useAuth from "@/utils/hooks/useAuth";
import { calculateAge, formatDate } from "@/utils/date/data.util";
import { IoChatbubbleSharp } from "react-icons/io5";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Matches() {
    const [matches, setMatches] = useState<any[]>([]);
    const { identity, setIsLoading } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();

    const getMatches = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/users/matches", {
                params: {
                    accepted_only: true,
                },
            });
            setMatches(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMatches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="py-6 px-6">
            <div className="flex justify-between items-center mb-5">
                <IoIosArrowBack size={30} onClick={() => router.back()} />
                <BsFillInboxesFill
                    size={27}
                    onClick={() => router.push("matches/processes")}
                />
            </div>
            <div className="mb-5">
                <h1 className="font-semibold text-2xl">Matched List</h1>
                <p>Total matched {matches?.length} people!</p>
            </div>
            <div className="flex flex-col gap-2">
                {matches?.length === 0 && <p>No matched people available.</p>}
                {matches &&
                    matches.map((match, index) => {
                        const partner =
                            match.sender.id === identity?.id
                                ? match.receiver
                                : match.sender;
                        return (
                            <div
                                key={index + match.id}
                                className="flex justify-between items-center px-3 "
                            >
                                <div className="px-0 py-2 rounded-lg shadow-md flex items-center gap-4">
                                    <Avatar
                                        showFallback
                                        src={partner.photoProfile?.path}
                                        className="w-14 h-14"
                                    />
                                    <div>
                                        <p className="font-bold text-xl">
                                            {partner.name.split(" ")[0]},{" "}
                                            {calculateAge(partner.birth)}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Matched on{" "}
                                            {formatDate(match.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={`/chats/${match.id}`}
                                    className="bg-gray-700 px-0 py-2 rounded-full shadow-md flex items-center justify-center w-12 h-12"
                                >
                                    <IoChatbubbleSharp size={30} />
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
