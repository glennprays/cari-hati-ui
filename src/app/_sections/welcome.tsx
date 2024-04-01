import { Montserrat_Alternates } from "next/font/google";
import Image from "next/image";
import { Button } from "@nextui-org/button";

const montserrat = Montserrat_Alternates({ weight: "800", subsets: ["latin"] });

export default function WelcomePage({
    onToggleLogin,
    onToggleRegistration,
}: {
    onToggleLogin: () => void;
    onToggleRegistration: () => void;
}) {
    return (
        <div className="p-10 w-full h-[100vh] bg-primary-gradient">
            <div className="flex items-end w-full justify-center mt-[15vh] select-none">
                <Image
                    src="cari-hati-icon-white.svg"
                    alt="Cari Hati icon"
                    width={45}
                    height={45}
                    priority
                />
                <span
                    className={`${montserrat.className} text-4xl tracking-wide`}
                >
                    CariHati
                </span>
            </div>
            <p className="font-extralight text-justify mt-[15vh] text-sm select-none">
                By tapping Create New Account or Log In, you agree to our Terms.
                Learn how we process your data in our Privacy Policy and Cookies
                Policy.
            </p>
            <div className="w-full flex flex-col items-center mt-[35px]">
                <p className="text-white font-light text-md px-[50px] py-[20px] hover:underline cursor-pointer">
                    Create New Account
                </p>
                <Button
                    onPress={onToggleLogin}
                    radius="full"
                    variant="bordered"
                    className="text-white font-light border-[.5px] border-white text-[20px] px-[50px] py-[25px] cursor-pointer m-0"
                >
                    LOGIN WITH EMAIL
                </Button>
            </div>
            <p className="hover:underline mt-[15vh] text-center">
                Trouble Logging In?
            </p>
        </div>
    );
}
