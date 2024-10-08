import axios from "axios";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function User() {
    const [user, setUser] = useState(null);

    useEffect(async () => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/me`, {
                    withCredentials: true, // Ensure cookies are sent
                });

                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>{user?.name}</h1>
            <h5>{user?.email}</h5>
        </div>
    );
}

export default User;
