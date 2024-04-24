"use client";
import { calculateAge } from "@/utils/date/data.util";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { Avatar } from "@nextui-org/react";
import React from "react";

const settingMenus = [
    {
        title: "Personal Data",
        path: "/settings/personal-data",
    },
    {
        title: "Passions",
        path: "/settings/passions",
    },
    {
        title: "Account",
        path: "/settings/account",
    },
    {
        title: "Photo Gallery",
        path: "/settings/photo-gallery",
    },
];
export default function Settings() {
    const [profile, setProfile] = useState<any>({});
    const { logout, setIsLoading } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const axiosPrivate = useAxiosPrivate();

    const handlePhotoClick = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                setSelectedFile(files[0]);
            }
        };
        fileInput.click();
    };

    const handleUpload = async () => {
        try {
            setIsLoading(true);
            if (selectedFile) {
                const formData = new FormData();
                formData.append("image", selectedFile);
                await axiosPrivate.put(
                    "/api/v1/users/profile/photo",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                getProfile();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedFile) {
            handleUpload();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);

    const getProfile = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/users/profile");
            setProfile(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        setIsLoading(true);
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="py-12 px-6">
            <h1 className="mb-5 text-3xl font-bold">Profile</h1>
            <div className="mb-5 flex w-full flex-col items-center gap-3">
                <Avatar
                    isBordered
                    showFallback
                    color="secondary"
                    src={profile.photoProfile?.path}
                    className="w-44 h-44"
                    onClick={handlePhotoClick}
                />
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-semibold">
                        {profile?.name ? profile.name.split(" ")[0] : null},{" "}
                        {profile?.birth ? calculateAge(profile.birth) : null}{" "}
                    </span>
                    <MdOutlineVerified size={30} />
                </div>
            </div>
            <Link
                href="/matches"
                className="mb-5 flex cursor-pointer items-center justify-between py-2"
            >
                <span className="text-lg">Matched List</span>
                <IoIosArrowForward size={30} />
            </Link>
            <h1 className="mb-2 text-2xl font-bold">Settings</h1>
            <div className="flex flex-col">
                {settingMenus.map((menu) => (
                    <Link
                        href={menu.path}
                        key={menu.title}
                        className="flex cursor-pointer items-center justify-between py-2"
                    >
                        <span className="text-lg">{menu.title}</span>
                        <IoIosArrowForward size={30} />
                    </Link>
                ))}
                <div
                    key="logout"
                    onClick={logout}
                    className="flex cursor-pointer items-center justify-between py-2"
                >
                    <span className="text-lg">Logout</span>
                    <IoIosArrowForward size={30} />
                </div>
            </div>
        </div>
    );
}
