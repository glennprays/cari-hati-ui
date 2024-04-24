"use client";
import useAuth from "@/utils/hooks/useAuth";
import useFcmToken from "@/utils/hooks/useFcmToken";
import axios from "@/utils/requester/axios";
import { AxiosError } from "axios";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
    const { fcmToken } = useFcmToken();
    const { setAuth, accessToken, setIsUserActivated } = useAuth();

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const [isInvalid, setIsInvalid] = useState({
        email: false,
        password: false,
        passwordConfirmation: false,
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (handleFormDataValidation() && fcmToken && fcmToken !== "") {
            setFormData((prevState) => ({
                ...prevState,
                fcm_token: fcmToken,
            }));
            const form = {
                ...formData,
                fcm_token: fcmToken,
            };
            await sendSignupForm(form);
        }
    };

    const handleFormDataValidation = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsInvalid({
            email: false,
            password: false,
            passwordConfirmation: false,
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

        if (
            formData.password !== formData.passwordConfirmation ||
            formData.passwordConfirmation !== ""
        ) {
            setIsInvalid((prevState) => ({
                ...prevState,
                passwordConfirmation: true,
            }));
        }
        return !(
            isInvalid.email ||
            isInvalid.password ||
            isInvalid.passwordConfirmation
        );
    };

    const sendSignupForm = async (
        form: typeof formData & { fcm_token: string }
    ) => {
        try {
            const response = await axios.post("/api/v1/auth/register", form);
            const accessToken = response.data.access_token;
            setAuth(accessToken);
            setIsUserActivated(response.data.is_activated ? true : false);
            setFormData({
                email: "",
                password: "",
                passwordConfirmation: "",
            });
            router.push("/activation");
        } catch (error) {
            console.log(error);
            if ((error as AxiosError).response) {
                setErrorMessage(
                    (error as AxiosError).message || "Registration failed"
                );
            } else {
                setErrorMessage(
                    "An error occurred. Please check your network connection."
                );
            }
        }
    };

    useEffect(() => {
        if (accessToken) {
            router.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);
    return (
        <div className="p-10 w-full h-[100vh] flex flex-col items-center justify-center">
            <div className="flex flex-col gap-7 select-none">
                <div className="flex flex-col items-start w-full mb-5">
                    <p className="text-[30px] font-medium ">Credential Data</p>
                    <p className="text-gray-300">Please complete data bellow</p>
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-5 "
            >
                {errorMessage && (
                    <Card className="bg-pink-1 rounded-md">
                        <CardBody>
                            <p>{errorMessage}</p>
                        </CardBody>
                    </Card>
                )}
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
                </div>
                <Input
                    type="password"
                    label="Password Confirmation"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    isInvalid={isInvalid.passwordConfirmation}
                    errorMessage={
                        isInvalid.passwordConfirmation
                            ? "Password and password confirmation must be the same"
                            : undefined
                    }
                />
                <Button
                    className="bg-pink-1 hover:bg-pink-2 text-xl font-medium"
                    radius="full"
                    type="submit"
                >
                    Create Account
                </Button>
            </form>
        </div>
    );
}
