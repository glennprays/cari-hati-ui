"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import useRefreshToken from "@/utils/hooks/useRefreshToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import { calculateAge } from "@/utils/date/data.util";
import { Chip } from "@nextui-org/react";

export default function Home() {
    const { logout, identity, accessToken, isUserActivated } = useAuth();
    const [matches, setMatches] = useState<any[]>([]);
    const [currentMatch, setCurrentMatch] = useState<number>(0);

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
        }
    };

    useEffect(() => {
        if (accessToken !== "") {
            getMatches();
            if (!isUserActivated) {
                router.push("/activation");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);
    return (
        <div
            className="flex flex-col gap-5 items-center justify-center pt-12"
            suppressHydrationWarning
        >
            {matches.length > 0 ? (
                <>
                    <Image
                        isBlurred
                        width={240}
                        src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${matches[currentMatch]?.photoProfile?.path}`}
                        alt={matches[currentMatch]?.name}
                        className="m-5"
                    />
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-xl">
                            {matches[currentMatch]?.name},{" "}
                            {calculateAge(matches[currentMatch]?.birth)}
                        </h1>
                        <p>{matches[currentMatch]?.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-[.5] px-11 justify-center">
                        {matches[currentMatch]?.passions?.map(
                            (passion: any) => (
                                <Chip
                                    key={passion.name + passion.createdAt}
                                    color="default"
                                    className="m-1"
                                >
                                    {passion.name}
                                </Chip>
                            )
                        )}
                    </div>
                </>
            ) : (
                "No matches found"
            )}
        </div>
    );
}
