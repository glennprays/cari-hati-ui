"use client";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import React, { ChangeEventHandler, FormEvent, useState } from "react";

export default function Home() {
    const { fcmToken, notificationPermissionStatus } = useFcmToken();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isInvalid, setIsInvalid] = useState({
        email: false,
        password: false,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (handleFormDataValidation() && fcmToken && fcmToken !== "") {
            setFormData((prevState) => ({
                ...prevState,
                fcm_token: fcmToken,
            }));
            const form = {
                ...formData,
                fcm_token: fcmToken,
            };
            console.log("form data: ", form);
            await sendSignInForm(form);
        }
    };

    const handleFormDataValidation = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsInvalid({
            email: false,
            password: false,
        });

        if (!emailRegex.test(formData.email)) {
            setIsInvalid((prevState) => ({
                ...prevState,
                email: true,
            }));
        }
        if (!passwordRegex.test(formData.password)) {
            setIsInvalid((prevState) => ({
                ...prevState,
                password: true,
            }));
        }
        return !(isInvalid.email && isInvalid.password);
    };

    const sendSignInForm = async (
        form: typeof formData & { fcm_token: string }
    ) => {
        try {
            const response = await axios.post("/api/v1/auth/signin", form);
            console.log(response.data);
            setFormData({
                email: "",
                password: "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-10 w-full h-[100vh] flex items-center">
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-5 "
            >
                <p className="text-[43px] font-bold mb-5">Sign Up</p>
                <Input
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={isInvalid.email}
                    errorMessage={
                        isInvalid.email
                            ? "Please enter a valid email"
                            : undefined
                    }
                />
                <div>
                    <Input
                        type="password"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={isInvalid.password}
                        errorMessage={
                            isInvalid.password
                                ? "Minimum 8 characters with at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)."
                                : undefined
                        }
                    />
                    <Link
                        prefetch={false}
                        href="/forget-password"
                        className="italic hover:underline text-gray-300 text-sm"
                    >
                        Forget password?
                    </Link>
                </div>
                <Button
                    className="bg-pink-1 hover:bg-pink-2 text-xl font-medium"
                    radius="full"
                    type="submit"
                >
                    SUBMIT
                </Button>
            </form>
        </div>
    );
}
