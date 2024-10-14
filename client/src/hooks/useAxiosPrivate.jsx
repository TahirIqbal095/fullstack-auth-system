import { useEffect } from "react";
import useRefresh from "./useRefresh";
import { axiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = useRefresh();

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            (response) => response,

            async (error) => {
                const prevReq = error?.config;
                if ((error.response?.status === 401) & !prevReq.sent) {
                    prevReq.sent = true;
                    const newAccessToken = await refreshToken();

                    if (newAccessToken) {
                        prevReq.headers[
                            "Authorization"
                        ] = `Bearer ${newAccessToken}`;
                    }
                    return axiosPrivate(prevReq);
                }
            },

            (error) => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken]);

    return axiosPrivate;
};

export default useAxiosPrivate;
