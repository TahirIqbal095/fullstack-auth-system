import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_URL = import.meta.env.VITE_API_URL;

function User() {
    const [user, setUser] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const controller = new AbortController();

        const fetchUserData = async () => {
            try {
                const response = await axiosPrivate.get(`${API_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    signal: controller.signal,
                });

                setUser(response?.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <div>
            <h1>{user?.name}</h1>
            <h5>{user?.email}</h5>
        </div>
    );
}

export default User;
