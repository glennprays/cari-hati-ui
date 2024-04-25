"use client";
import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { PiSpeakerHighBold } from "react-icons/pi";

const notificationIcons = [
    {
        type: "like",
        background: "bg-pink-1",
        icon: <FaRegHeart size={25} />,
    },
    {
        type: "match",
        background: "bg-blue-1",
        icon: <FaRegBell size={25} />,
    },
    {
        type: "warning",
        background: "bg-yellow-400",
        icon: <IoWarningOutline size={25} />,
    },
    {
        type: "anouncement",
        background: "bg-green-400",
        icon: <PiSpeakerHighBold size={25} />,
    },
];
type NotificationType = {
    title: string;
    description: string;
    time: string;
    type: string;
    path: string | null;
};

const notifications: NotificationType[] = [
    {
        title: "Someone Liked You",
        description: "Anisa like you, click for more info.",
        time: "2 hours ago",
        type: "like",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Vallery want to match with you!",
        time: "27/01/2024",
        type: "match",
        path: null,
    },
    {
        title: "Someone Liked You",
        description: "Donna like you, click for more info.",
        time: "13/01/2024",
        type: "like",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "warning",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Assy want to match with you!",
        time: "10/01/2024",
        type: "anouncement",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "match",
        path: null,
    },
    {
        title: "Someone Liked You",
        description: "Anisa like you, click for more info.",
        time: "2 hours ago",
        type: "like",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "match",
        path: null,
    },
    {
        title: "Someone Liked You",
        description: "Anisa like you, click for more info.",
        time: "2 hours ago",
        type: "like",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "match",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "match",
        path: null,
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "match",
        path: null,
    },
];

export default function Notification() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    const { setIsLoading } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();

    const getNotifications = async (limit: number = 50, offset: number = 0) => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get(
                `/api/v1/users/notifications?limit=${limit}&offset=${offset}`
            );
            const data = response.data.map((notification: any) => {
                return {
                    title: notification.title,
                    description: notification.body,
                    time: notification.createdAt,
                    type: notification.type,
                    path: notification.path,
                };
            });
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getNotifications();
        return () => {
            setNotifications([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="py-12">
            <h1 className="font-bold text-3xl mb-5 px-6">Notification</h1>
            {notifications.length === 0 && (
                <p className="px-6">No notification available.</p>
            )}
            <div className="flex flex-col gap-0">
                {notifications.map((notification, index) => (
                    <div
                        key={index}
                        className="flex flex-row gap-5 px-5 py-3 rounded-lg items-center hover:bg-gray-800 cursor-pointer"
                        onClick={() => router.push(notification.path || "")}
                    >
                        <div
                            className={`flex items-center justify-center w-14 h-14 rounded-full text-white ${
                                notificationIcons.find(
                                    (icon) => icon.type === notification.type
                                )?.background
                            }`}
                        >
                            {
                                notificationIcons.find(
                                    (icon) => icon.type === notification.type
                                )?.icon
                            }
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-semibold text-lg">
                                {notification.title}
                            </h1>
                            <p>{notification.description}</p>
                            <p className="text-gray-400 text-sm">
                                {notification.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
