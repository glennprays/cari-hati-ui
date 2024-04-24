"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import useRefreshToken from "@/utils/hooks/useRefreshToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import { calculateAge } from "@/utils/date/data.util";
import { Chip } from "@nextui-org/react";
import { MdOutlineVerified } from "react-icons/md";
import { MdReplay } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { GoStarFill } from "react-icons/go";
import { Button } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

const actions: { name: string; icon: any; borderColor: string }[] = [
    {
        name: "Previous",
        icon: <MdReplay size={30} className="text-gray-300" />,
        borderColor: "border-gray-500",
    },
    {
        name: "Like",
        icon: <IoHeart size={30} className="text-pink-1" />,
        borderColor: "border-pink-1",
    },
    {
        name: "Match",
        icon: <GoStarFill size={30} className="text-yellow-500" />,
        borderColor: "border-yellow-500",
    },
    {
        name: "Next",
        icon: <IoCloseOutline size={30} className="text-red-500" />,
        borderColor: "border-red-500",
    },
];

export default function Home() {
    const { logout, identity, accessToken, isUserActivated, setIsLoading } =
        useAuth();
    const [matches, setMatches] = useState<any[]>([]);
    const [currentMatch, setCurrentMatch] = useState<number>(0);
    const [isLoadingRequestMatch, setIsLoadingRequestMatch] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();

    const getMatches = async (limit: number = 10, offset: number = 0) => {
        try {
            const response = await axiosPrivate.get(
                `/api/v1/users/matches/recommendations?limit=${limit}&offset=${offset}`
            );
            setMatches((prev: any[]) => [...prev, ...response.data]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const matchRequest = async (userId: string, liked: boolean = false) => {
        try {
            setIsLoadingRequestMatch(true);
            await axiosPrivate.post("/api/v1/users/matches", {
                receiverId: userId,
                liked: liked,
            });
            setMatches((prev) => prev.filter((match) => match.id !== userId));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingRequestMatch(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        if (accessToken !== "") {
            getMatches();
            // if (!isUserActivated) {
            //     router.push("/activation");
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);
    return (
        <div
            className="pt pt-20 flex flex-col items-center justify-center w-full"
            suppressHydrationWarning
        >
            {matches.length > 0 ? (
                <>
                    <div className="flex flex-col gap-5 items-center justify-center">
                        <Image
                            height={240}
                            width={240}
                            src={
                                matches[currentMatch]?.photoProfile
                                    ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${matches[currentMatch]?.photoProfile?.path}`
                                    : "/assets/images/photo-profile-callback.jpg"
                            }
                            alt={matches[currentMatch]?.name}
                            className="m-5"
                        />
                        <div className="flex flex-col text-center">
                            <span className="flex gap-2 font-semibold text-2xl">
                                <p>
                                    {matches[currentMatch]?.name},{" "}
                                    {calculateAge(matches[currentMatch]?.birth)}
                                </p>
                                <MdOutlineVerified size={30} />
                            </span>
                            <p className="">
                                {matches[currentMatch]?.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-[.5] px-11 justify-center">
                            {matches[currentMatch]?.passions?.map(
                                (passion: any) => (
                                    <Chip
                                        key={passion.name + passion.createdAt}
                                        color="default"
                                        className="m-1"
                                        variant="bordered"
                                    >
                                        {passion.name}
                                    </Chip>
                                )
                            )}
                        </div>
                    </div>
                    <div className="gap-3 flex mt-10">
                        {isLoadingRequestMatch ? (
                            <CircularProgress
                                size="lg"
                                aria-label="Loading..."
                            />
                        ) : (
                            actions.map((action, index) => (
                                <Button
                                    isIconOnly
                                    key={action.name + index}
                                    className={`flex bg-transparent items-center justify-center p-3 w-[65px] h-[65px] rounded-full border-2 ${action.borderColor}`}
                                    onClick={() => {
                                        if (action.name === "Next") {
                                            setCurrentMatch((prev) =>
                                                prev === matches.length - 1
                                                    ? 0
                                                    : prev + 1
                                            );
                                        } else if (action.name === "Previous") {
                                            setCurrentMatch((prev) =>
                                                prev === 0
                                                    ? matches.length - 1
                                                    : prev - 1
                                            );
                                        } else if (action.name === "Like") {
                                            matchRequest(
                                                matches[currentMatch]?.id,
                                                true
                                            );
                                        } else if (action.name === "Match") {
                                            matchRequest(
                                                matches[currentMatch]?.id
                                            );
                                        }
                                    }}
                                    disabled={
                                        (action.name === "Next" &&
                                            currentMatch ===
                                                matches.length - 1) ||
                                        (action.name === "Previous" &&
                                            currentMatch === 0)
                                    }
                                >
                                    {action.icon}
                                </Button>
                            ))
                        )}
                    </div>
                </>
            ) : (
                "No matches found"
            )}
        </div>
    );
}
