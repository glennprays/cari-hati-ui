"use client";
import { calculateAge } from "@/utils/date/data.util";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Avatar, Button, Chip } from "@nextui-org/react";
import { set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

type Props = {
    params: {
        id: string;
    };
};
export default function Match({ params }: Props) {
    const [match, setMatch] = useState<any>(null);
    const [partner, setPartner] = useState<any>(null);
    const { setIsLoading, identity } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();

    const fetchMatch = async () => {
        try {
            const response = await axiosPrivate.get(
                `/api/v1/users/matches/${params.id}`
            );
            const partner =
                response.data.sender === identity?.id
                    ? response.data.receiver
                    : response.data.sender;
            console.log(partner);
            setMatch(response.data);
            setPartner(partner);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateMatch = async (status: string) => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.post(
                `/api/v1/users/matches/status`,
                {
                    id: params.id,
                    state: status,
                }
            );
            setMatch(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchMatch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-5">
                <IoIosArrowBack size={30} onClick={() => router.back()} />
            </div>
            <div className="mb-5 flex w-full flex-col items-center gap-3">
                <Avatar
                    isBordered
                    showFallback
                    color="secondary"
                    src={partner?.photoProfile?.path}
                    className="w-44 h-44"
                />
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-semibold">
                        {partner?.name ? partner.name : null},{" "}
                        {partner?.birth ? calculateAge(partner.birth) : null}{" "}
                    </span>
                    <MdOutlineVerified size={30} />
                </div>
            </div>
            <p className="text-center mb-5">{partner?.description}</p>
            <div className="flex flex-wrap gap-[.5] px-11 justify-center">
                {partner?.passions?.map((passion: any) => (
                    <Chip
                        key={passion.name + passion.createdAt}
                        color="default"
                        className="m-1"
                        variant="bordered"
                    >
                        {passion.name}
                    </Chip>
                ))}
            </div>
            {match?.status !== "accepted" ? (
                identity?.id !== match?.receiver ? (
                    <div className="flex flex-col items-center justify-center gap-5 mt-5">
                        <div className="flex items-center gap-5">
                            <Button
                                className={`flex bg-white items-center justify-center p-3 w-[50px] h-[50px] rounded-full`}
                                onClick={() => handleUpdateMatch("accepted")}
                            >
                                <FaCheck size={30} className="text-pink-1" />
                            </Button>
                            <Button
                                className={`flex bg-white items-center justify-center p-3 w-[50px] h-[50px] rounded-full`}
                                onClick={() => handleUpdateMatch("rejected")}
                            >
                                <IoCloseOutline
                                    size={30}
                                    className="text-gray-500"
                                />
                            </Button>
                        </div>
                        <Button
                            className="rounded-xl py-2 px-6 bg-gray-500"
                            onClick={() => handleUpdateMatch("ignore")}
                        >
                            Ignore
                        </Button>
                    </div>
                ) : (
                    <p className="text-center mt-5">Waiting for response</p>
                )
            ) : (
                <p className="text-center mt-5">Accepted</p>
            )}
        </div>
    );
}
