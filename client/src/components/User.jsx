import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function User() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}/me`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                    },
                });

                const responseData = await response.json();
                setUser(responseData);
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
