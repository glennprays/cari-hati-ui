import { FaRegHeart } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";

const notificationIcons = [
    {
        type: "like",
        background: "bg-pink-1",
        icon: <FaRegHeart />,
    },
    {
        type: "match",
        background: "bg-blue-1",
        icon: <FaRegBell />,
    },
];

const notifications = [
    {
        title: "Someone Liked You",
        description: "Anisa like you, click for more info.",
        time: "2 hours ago",
        type: "like",
    },
    {
        title: "Someone Want to Match",
        description: "Vallery want to match with you!",
        time: "27/01/2024",
        type: "match",
    },
    {
        title: "Someone Liked You",
        description: "Donna like you, click for more info.",
        time: "13/01/2024",
        type: "like",
    },
    {
        title: "Someone Want to Match",
        description: "Luna want to match with you!",
        time: "13/01/2024",
        type: "match",
    },
    {
        title: "Someone Want to Match",
        description: "Assy want to match with you!",
        time: "10/01/2024",
        type: "match",
    },
];
export default function Notification() {
    return (
        <div className="py-12">
            <h1 className="font-bold text-2xl mb-5">Notification</h1>
            <div className="flex flex-col gap-5">
                {notifications.map((notification, index) => (
                    <div
                        key={index}
                        className="flex flex-row gap-2 p-5 rounded-lg "
                    >
                        <div
                            className={`flex items-center justify-center w-12 h-12 rounded-lg text-white ${
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
