"use client";
import {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from "react";
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
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    isUserActivated: boolean;
    setUserActivatedStatus: (status: boolean) => Promise<void>;
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
    setIsLoading: () => {},
    isUserActivated: false,
    setUserActivatedStatus: async (status: boolean) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [isUserActivated, setIsUserActivated] = useState<boolean>(false);
    const router = useRouter();
    const { setFcmToken } = useFcmToken();

    const refreshToken = useRefreshToken();

    const LOCALFORAGE_TOKEN_KEY = "accessTokenCh";
    const LOCALFORAGE_ACTIVATED_KEY = "isUserActivatedCh";

    const setAuth = async (token: string) => {
        setIsLoading(true);
        if (token !== "") {
            await localforage.setItem(LOCALFORAGE_TOKEN_KEY, token);
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
            await localforage.removeItem(LOCALFORAGE_TOKEN_KEY);
            await localforage.removeItem(LOCALFORAGE_ACTIVATED_KEY);
            setAccessToken("");
            setFcmToken("");
            setIdentity(null);
            setIsUserActivated(false);
            router.replace("/");
            setIsLoading(false);
        }
    };

    const setUserActivatedStatus = async (status: boolean) => {
        setIsLoading(true);
        await localforage.setItem(LOCALFORAGE_ACTIVATED_KEY, status);
        setIsUserActivated(status);
        setIsLoading(false);
    };

    const getAccessToken = async () => {
        setIsLoading(true);
        try {
            const token = await localforage.getItem<string>(
                LOCALFORAGE_TOKEN_KEY
            );
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

    const getUserActivatedStatus = async () => {
        setIsLoading(true);
        try {
            const status = await localforage.getItem<boolean>(
                LOCALFORAGE_ACTIVATED_KEY
            );
            if (status !== null) {
                setIsUserActivated(status);
            }
        } catch (error) {
            console.error("Failed to get user activated status", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAccessToken();
        getUserActivatedStatus();
        // eslint-disable-next-line
    }, []);

    const authContexValue = {
        accessToken,
        identity,
        setAuth,
        logout,
        isLoading,
        setIsLoading,
        isUserActivated,
        setUserActivatedStatus,
    };

    return (
        <AuthContext.Provider value={authContexValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
