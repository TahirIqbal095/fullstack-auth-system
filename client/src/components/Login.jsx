import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const notify = (message) => toast.success(message);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post(`${API_URL}/login`, {
            email: username,
            password: password,
        });

        localStorage.setItem("token", response.data.token);
        notify(response.data.message);
        navigate("/me");
    };

    return (
        <div>
            <h1>Log in page</h1>

            <form action="post">
                <div>
                    <span>Enter the email : </span>
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <span>Enter the password : </span>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit}>Login</button>
                <Toaster />
            </form>
        </div>
    );
}

export default Login;
