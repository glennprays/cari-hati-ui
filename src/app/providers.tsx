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
import MobileScreen from "./MobileScreen";
import useAuth from "@/utils/hooks/useAuth";
import { LoadingFullPage } from "@/components/loading";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [notificationPermission, setNotificationPermission] =
        useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isLoading } = useAuth();
    useEffect(() => {
        const checkPermission = () => {
            if (
                window.Notification.permission !== "granted" &&
                typeof window !== "undefined"
            ) {
                setNotificationPermission(true);
                onOpen();
            }
        };

        checkPermission();
    }, [onOpen]);

    return (
        <div suppressHydrationWarning>
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
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <MobileScreen>
                    <LoadingFullPage show={isLoading} />
                    {children}
                </MobileScreen>
            </NextUIProvider>
        </div>
    );
}
