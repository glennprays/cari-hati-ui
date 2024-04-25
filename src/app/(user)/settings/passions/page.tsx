"use client";

import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Button, Chip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function Passions() {
    const [passions, setPassions] = useState<any[]>([]);
    const [selectedPassions, setSelectedPassions] = useState<any[]>([]);
    const { setIsLoading } = useAuth();
    const router = useRouter();

    const axiosPrivate = useAxiosPrivate();

    const getPassions = async (limit: number = 50, offset: number = 0) => {
        try {
            const response = await axiosPrivate.get(
                `/api/v1/data/passions?${limit}&offset=${offset}`
            );
            setPassions(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getUserPassions = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/users/passions");
            setSelectedPassions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getPassions();
        getUserPassions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectPassion = (passion: any) => {
        const passionsIds = selectedPassions.map((passion) => passion.id);
        if (selectedPassions.length < 5 && !passionsIds.includes(passion.id)) {
            setSelectedPassions((prev) => [...prev, passion]);
        }
    };

    const handleDeselectPassion = (passion: any) => {
        setSelectedPassions((prev) => prev.filter((p) => p.name !== passion.name));
    };

    const handleSavePassions = async () => {
        try {
            setIsLoading(true);
            if (selectedPassions.length < 5) {
                return;
            }
            await axiosPrivate.put(
                "/api/v1/users/passions",
                selectedPassions.map((passion) => ({ id: passion.id }))
            );
            router.push("/settings");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-6 px-6">
            <div className="flex justify-between items-center mb-5">
                <IoIosArrowBack size={30} onClick={() => router.back()} />
            </div>
            <h1 className="mb-5 text-3xl font-bold">Passions</h1>
            <h2 className="mb-5 text-lg font-semibold">Selected passions</h2>
            {selectedPassions.length === 0 && "No selected passions."}
            {selectedPassions?.map((passion: any) => (
                <Chip
                    key={passion.name + passion.createdAt}
                    color="default"
                    className="m-1"
                    variant="bordered"
                    onClose={() => handleDeselectPassion(passion)}
                >
                    {passion.name}
                </Chip>
            ))}
            <p className="mb-5 text-lg mt-10">
                What are your passions? Select five passions.
            </p>

            <div className="flex flex-wrap gap-[.5] px-11 justify-center">
                {passions
                    ?.filter(
                        (passion: any) =>
                            !selectedPassions
                                .map((p) => p.name)
                                .includes(passion.name)
                    )
                    .map((passion: any) => (
                        <Chip
                            key={passion.name + passion.createdAt}
                            color="default"
                            className="m-1"
                            variant="bordered"
                            onClick={() => handleSelectPassion(passion)}
                        >
                            {passion.name}
                        </Chip>
                    ))}
            </div>

            <div className="flex justify-center mt-10">
                <Button
                    className="bg-pink-1 hover:bg-pink-2 text-xl font-medium px-28"
                    radius="full"
                    type="submit"
                    onClick={handleSavePassions}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
