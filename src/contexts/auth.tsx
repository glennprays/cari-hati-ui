"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LoadingFullPage } from "@/components/loading";
import axios from "axios";
import localforage from "localforage";
import { getMessaging, deleteToken } from "firebase/messaging";
import firebaseApp from "../utils/firebase/firebase";
import useFcmToken from "@/utils/hooks/useFcmToken";

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => Promise<void>;
    accessToken: string | null;
}

type User = {
    email: string;
    role: string;
    id: string;
};

interface JwtPayload {
    username: string;
    sub: {
        role: string;
        id: string;
    };
    iat: number;
    exp: number;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: (token: string) => {},
    logout: async () => {},
    accessToken: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null
    );
    const { setFcmToken } = useFcmToken();

    const login = (token: string) => {
        setAccessToken(token);
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post("/api/v1/auth/signout");
        } catch (error) {
            console.log(error);
        } finally {
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
            }
            const messaging = getMessaging(firebaseApp);
            deleteToken(messaging);
            localforage.removeItem(
                process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
            );
            setFcmToken("");
            setUser(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadUserFromLocalStorage = () => {
            setLoading(true);
            if (accessToken) {
                try {
                    const decodedUserData = jwtDecode<JwtPayload>(accessToken);
                    const now = Math.floor(Date.now() / 1000);
                    if (
                        decodedUserData &&
                        typeof decodedUserData.exp !== "undefined" &&
                        now < decodedUserData.exp
                    ) {
                        setUser({
                            email: decodedUserData.username,
                            role: decodedUserData.sub.role,
                            id: decodedUserData.sub.id,
                        });
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.log("Error decoding access token:", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            }
        };

        if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            loadUserFromLocalStorage();
        } else {
            localStorage.removeItem("access_token");
            setUser(null);
            setLoading(false);
        }
    }, [accessToken]);

    const authContextValue = {
        user,
        login,
        logout,
        accessToken,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <LoadingFullPage show={loading} />
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
