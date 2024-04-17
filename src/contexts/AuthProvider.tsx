"use client";
import { createContext, useEffect, useState } from "react";
import localforage from "localforage";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import axios from "@/utils/requester/axios";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { jwtDecode } from "@/utils/jwt/jwt.util";
import useRefreshToken from "@/utils/hooks/useRefreshToken";

type Auth = {
    accessToken: string;
    identity: Identity | null;
    setAuth: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

type Identity = {
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

const AuthContext = createContext<Auth>({
    accessToken: "",
    identity: null,
    setAuth: async (token: string) => {},
    logout: async () => {},
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const router = useRouter();
    const { setFcmToken } = useFcmToken();

    const refreshToken = useRefreshToken();

    const LOCALFORAGE_KEY = "accessTokenCh";

    const setAuth = async (token: string) => {
        setIsLoading(true);
        if (token !== "") {
            await localforage.setItem(LOCALFORAGE_KEY, token);
            const decodedUserData = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            if (!decodedUserData || decodedUserData.exp < now) {
                await logout();
            } else {
                setAccessToken(token);
                setIdentity({
                    email: decodedUserData.username,
                    role: decodedUserData.sub.role,
                    id: decodedUserData.sub.id,
                });
            }
        }
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await axios.post("/api/v1/auth/signout");
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(axiosError.response?.data);
        } finally {
            await localforage.removeItem(LOCALFORAGE_KEY);
            setAccessToken("");
            setFcmToken("");
            router.replace("/");
            setIsLoading(false);
        }
    };

    const getAccessToken = async () => {
        setIsLoading(true);
        try {
            const token = await localforage.getItem<string>(LOCALFORAGE_KEY);
            if (token !== "" && token) {
                const decodedUserData = jwtDecode(token);
                const now = Math.floor(Date.now() / 1000);
                if (!decodedUserData || decodedUserData.exp < now) {
                    const newToken = await refreshToken();
                    if (!newToken) {
                        await logout();
                    }
                    await setAuth(newToken);
                } else {
                    setAccessToken(token);
                    setIdentity({
                        email: decodedUserData.username,
                        role: decodedUserData.sub.role,
                        id: decodedUserData.sub.id,
                    });
                }
            }
        } catch (error) {
            console.error("Failed to get access token", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAccessToken();
        // eslint-disable-next-line
    }, []);

    const authContexValue = {
        accessToken,
        identity,
        setAuth,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={authContexValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
