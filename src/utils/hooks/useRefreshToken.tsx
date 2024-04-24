import axios from "../requester/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post("/api/v1/auth/refresh");
        setAuth(response.data.access_token);
        return response.data.access_token;
    };
    return refresh;
}

export default useRefreshToken;
