import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function User() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}/me`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "applicatio/json",
                    },
                });

                const data = await response.json();
                setUser(data);
            } catch (error) {
                navigate("/register");
                toast.error("Something went wrong, please try again");
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
