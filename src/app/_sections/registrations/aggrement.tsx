import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

type rule = {
    title: string;
    description: string;
};
const rules: rule[] = [
    {
        title: "Be yourself",
        description: "Be genuine: real pics, honest age, and a bio that's you!",
    },
    {
        title: "Stay safe",
        description:
            "Don't share too much too soon, keep personal info on the low.",
    },
    {
        title: "Play it cool",
        description: "Be nice, treat others well, like you want to be treated.",
    },
    {
        title: "Be proactive",
        description:
            "Call out bad behavior, keep it chill, report if things get messy.",
    },
];
export default function Aggrement() {
    return (
        <div className="p-10 w-full h-[100vh] flex items-center">
            <div className="flex flex-col gap-7 select-none">
                <div className="flex flex-col items-center w-full mb-5">
                    <p className="text-[30px] font-medium ">
                        Welcome to CariHati
                    </p>
                    <p className="text-gray-300">
                        Please follow these house rules
                    </p>
                </div>
                <div className="flex flex-col gap-7">
                    {rules.map((rule, index) => (
                        <div className="flex gap-4" key={index}>
                            <FaCheck className="text-[20px] text-pink-1 content-start" />
                            <div>
                                <span className="text-[20px] font-medium mb-5">
                                    {rule.title}
                                </span>
                                <p className="text-gray-300">
                                    {rule.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full px-10">
                    <Link prefetch={false} href="/registration">
                        <Button
                            className="bg-pink-1 hover:bg-pink-2 text-xl font-medium mt-10 w-full"
                            radius="full"
                            type="submit"
                        >
                            I Agree
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
