"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BsChatFill } from "react-icons/bs";
import { BiSolidGift } from "react-icons/bi";
import { FaUser, FaHeart } from "react-icons/fa";
import { FaFire } from "react-icons/fa";

const menus = [
    {
        name: "Home",
        href: "/home",
        icon: <FaFire size={35} />,
    },
    {
        name: "Chat",
        href: "/chat",
        icon: <BsChatFill size={30} />,
    },
    {
        name: "Gift",
        href: "/gift",
        icon: <BiSolidGift size={35} />,
    },
    {
        name: "Notification",
        href: "/notification",
        icon: <FaHeart size={30} />,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: <FaUser size={30} />,
    },
];

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <nav className="bg-primary fixed bottom-0 w-full text-white py-4 px-6 flex justify-around items-center  max-w-[448px] border-t border-gray-800">
            {menus.map((menu, index) => (
                <div
                    key={index}
                    onClick={() => router.push(menu.href)}
                    className={`flex flex-col items-center hover:text-pink-1 ${
                        pathname === menu.href ? "text-pink-1" : ""
                    }`}
                >
                    {menu.icon}
                </div>
            ))}
        </nav>
    );
}
