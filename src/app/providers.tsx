"use client";

import { NextUIProvider } from "@nextui-org/react";
import FCMForeground from "./_firebase/fcm";
import { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [notificationPermission, setNotificationPermission] = useState(
        typeof window !== "undefined"
            ? window.Notification.permission
            : "default"
    );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const checkPermission = () => {
            if (
                notificationPermission !== "granted" &&
                typeof window !== "undefined"
            ) {
                onOpen();
            }
        };

        checkPermission();
    }, [notificationPermission]);
    const requestNotificationPermission = async (onClose: () => void) => {
        const permission = await (typeof window !== "undefined"
            ? window.Notification.requestPermission()
            : Promise.resolve("default"));
        if (permission === "granted") {
            onClose();
        }
    };

    return (
        <NextUIProvider>
            {notificationPermission && <FCMForeground />}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                hideCloseButton={true}
                className="dark"
                backdrop="blur"
                classNames={{
                    base: "max-w-[370px]",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Notification Access Required
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    You need to grant notification access to
                                    continue using the app.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="bg-pink-1"
                                    onPress={async () =>
                                        await requestNotificationPermission(
                                            onClose
                                        )
                                    }
                                >
                                    Request
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {children}
        </NextUIProvider>
    );
}
