import { useEffect } from "react";
import useRefresh from "./useRefresh";
import { axiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
    const refreshToken = useRefresh();

    useEffect(() => {
        const responseInterceptor = axiosPrivate.interceptors.response.use(
            (response) => response,

            async (error) => {
                const prevReq = error?.config;
                if ((error.response?.status === 401) & !prevReq.sent) {
                    prevReq.sent = true;
                    await refreshToken();
                    return axiosPrivate(prevReq);
                }
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return axiosPrivate;
};

export default useAxiosPrivate;
