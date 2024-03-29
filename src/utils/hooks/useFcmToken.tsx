import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

const useFcmToken = () => {
    const [token, setToken] = useState("");
    const [notificationPermissionStatus, setNotificationPermissionStatus] =
        useState("");

    useEffect(() => {
        const isTokenInLocalDatabase = () => {
            return new Promise<string | null>((resolve, reject) => {
                const request = indexedDB.open(
                    "firebase-messaging-database",
                    1
                );

                request.onsuccess = (event) => {
                    const database = (event.target as IDBOpenDBRequest).result;
                    const transaction = database.transaction(
                        ["firebase-messaging-store"],
                        "readonly"
                    );
                    const store = transaction.objectStore(
                        "firebase-messaging-store"
                    );
                    const getRequest = store.get(
                        process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
                    );

                    getRequest.onsuccess = (event) => {
                        const result = (event.target as IDBRequest).result;
                        if (result) {
                            resolve(result.token);
                        } else {
                            resolve(null);
                        }
                    };

                    getRequest.onerror = (event) => {
                        console.error(
                            "Error checking value:",
                            (event.target as IDBRequest).error
                        );
                        reject((event.target as IDBRequest).error);
                    };
                };

                request.onerror = (event) => {
                    console.error(
                        "Error opening database:",
                        (event.target as IDBOpenDBRequest).error
                    );
                    reject((event.target as IDBOpenDBRequest).error);
                };
            });
        };
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
                        const token = await isTokenInLocalDatabase();
                        if (token) {
                            setToken(token);
                        } else {
                            const currentToken = await getToken(messaging, {
                                vapidKey:
                                    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                            });
                            if (currentToken) {
                                setToken(currentToken);
                            } else {
                                console.log(
                                    "No registration token available. Request permission to generate one."
                                );
                            }
                        }
                    }
                }
            } catch (error) {
                console.log("An error occurred while retrieving token:", error);
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
