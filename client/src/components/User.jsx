import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const API_URL = import.meta.env.VITE_API_URL;

function User() {
    const [user, setUser] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosPrivate.get(`${API_URL}/me`);
                setUser(response.data);
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
