import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";
import * as localForage from "localforage";

const useFcmToken = () => {
    const [token, setToken] = useState("");
    const [notificationPermissionStatus, setNotificationPermissionStatus] =
        useState("");

    useEffect(() => {
        const TOKEN_KEY = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "";

        const retrieveToken = async () => {
            try {
                if (
                    typeof window !== "undefined" &&
                    "serviceWorker" in navigator
                ) {
                    const messaging = getMessaging(firebaseApp);

                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    if (permission === "granted") {
                        const storedToken: string | null =
                            await localForage.getItem(TOKEN_KEY);
                        if (storedToken) {
                            setToken(storedToken);
                            return;
                        }
                        const currentToken = await getToken(messaging, {
                            vapidKey:
                                process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        });

                        if (currentToken) {
                            setToken(currentToken);
                            await localForage.setItem(TOKEN_KEY, currentToken);
                        } else {
                            console.log(
                                "No registration token available. Request permission to generate one."
                            );
                        }
                    }
                }
            } catch (error) {
                console.log("An error occurred while retrieving token:", error);
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus, setFcmToken: setToken };
};

export default useFcmToken;
