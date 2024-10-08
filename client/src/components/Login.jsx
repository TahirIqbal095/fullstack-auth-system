import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            toast.success(data.message);
            navigate("/me");
        } else {
            toast.error(data.message);
        }
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
            </form>
        </div>
    );
}

export default Login;
