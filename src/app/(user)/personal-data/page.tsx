import useAxiosPrivate from "@/utils/hooks/useAxiosPrivate";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { parseDate } from "@internationalized/date";
import { Textarea } from "@nextui-org/react";
import useAuth from "@/utils/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function PersonalData() {
    const AxiosPrivate = useAxiosPrivate();
    const router = useRouter();
    const { setIsLoading } = useAuth();
    const [personalData, setPersonalData] = useState({
        name: "",
        gender: "",
        birth: parseDate(new Date().toISOString()),
        description: "",
    });
    const [isInvalid, setIsInvalid] = useState({
        name: false,
        gender: false,
        birth: false,
        description: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonalData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const postProfile = async () => {
        try {
            setIsLoading(true);
            await AxiosPrivate.post("/api/v1/users/profile", {
                name: personalData.name,
                gender: personalData.gender,
                birth: new Date(personalData.birth.toString()).toISOString(),
                description: personalData.description,
            });
            router.push("/home");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <form
                onSubmit={postProfile}
                className="w-full flex flex-col gap-5 "
            >
                <Input
                    type="text"
                    label="Name"
                    name="name"
                    value={personalData.name}
                    onChange={handleChange}
                    isInvalid={isInvalid.name}
                    errorMessage={
                        isInvalid.name ? "Please enter a valid name" : undefined
                    }
                />
                <RadioGroup
                    label="Gender"
                    value={personalData.gender || "male"}
                    onChange={handleChange}
                >
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                </RadioGroup>
                <DatePicker
                    label="Birthday"
                    value={personalData.birth}
                    onChange={(date) =>
                        setPersonalData((prevState) => ({
                            ...prevState,
                            birth: date,
                        }))
                    }
                />
                <Textarea
                    label="Description"
                    name="description"
                    placeholder="Enter your description"
                    className="max-w-xs"
                    onChange={handleChange}
                />
                <Button
                    className="bg-pink-1 hover:bg-pink-2 text-xl font-medium"
                    radius="full"
                    type="submit"
                >
                    Continue
                </Button>
            </form>
        </div>
    );
}
