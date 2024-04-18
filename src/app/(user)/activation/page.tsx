"use client";

import useAuth from "@/utils/hooks/useAuth";
import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Input } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
    const { isUserActivated, setUserActivatedStatus } = useAuth();
    const router = useRouter();

    const AxiosPrivate = useAxiosPrivate();

    const [code, setCode] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isInvalid, setIsInvalid] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setCode(parseInt(value));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsInvalid(false);
        if (handleCodeValidation() && code) {
            await activateUser(code);
        }
    };

    const handleCodeValidation = () => {
        const codeString = String(code);
        if (codeString.length !== 6) {
            setIsInvalid(true);
            console.error("The code must be a 6-digit number.");
            return false;
        }
        return true;
    };

    const activateUser = async (code: number) => {
        try {
            const response = await AxiosPrivate.post(
                "/api/v1/auth/account/activate",
                { code }
            );
            if (response.status === 200) {
                setUserActivatedStatus(true);
                router.replace("/home");
            }
        } catch (error) {
            const { response } = error as AxiosError;
            if (response?.status === 400) {
                setErrorMessage("Invalid activation code");
            } else {
                console.log(error);
                setErrorMessage("Something went wrong, please try again later");
            }
        }
    };

    const resendActivationCode = async () => {
        setErrorMessage("");
        try {
            const response = await AxiosPrivate.post(
                "/api/v1/auth/account/activate/code"
            );
        } catch (error) {
            const { response } = error as AxiosError;
            if (response?.status === 406) {
                setErrorMessage("Account Already Activated");
            } else {
                console.log(error);
                setErrorMessage("Something went wrong, please try again later");
            }
        }
    };

    useEffect(() => {
        if (isUserActivated) {
            router.push("/home");
        }
    }, [isUserActivated]);

    return (
        <div className="p-10 w-full h-[100vh] flex flex-col items-center justify-center">
            <div className="flex flex-col gap-7 select-none">
                <div className="flex flex-col items-start w-full mb-5">
                    <p className="text-[30px] font-medium ">
                        Verification Code
                    </p>
                    <p className="text-gray-300">
                        Please enter the code we sent to your email
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="number"
                    placeholder="Enter the 6-digit code"
                    value={String(code)}
                    onChange={handleChange}
                    className="p-2 rounded-md border border-gray-300"
                    isInvalid={isInvalid}
                    errorMessage={
                        isInvalid
                            ? "Activation code should be 6 (six) digits"
                            : null
                    }
                />
                <button
                    type="submit"
                    className="p-2 bg-pink-1 text-white rounded-full"
                >
                    Activate
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>
            <div className="flex">
                Didn't get the code?
                <span
                    onClick={resendActivationCode}
                    className="font-bold hover:underline"
                >
                    Resend
                </span>
            </div>
        </div>
    );
}
