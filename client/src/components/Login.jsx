import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const inputClasses =
        "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow";

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
        <div className="max-w-3xl p-4">
            <h1 className="text-2xl font-bold text-gray-600">Log in</h1>

            <form action="post" className="space-y-3 mt-6">
                <div>
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputClasses}
                        placeholder="Enter Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClasses}
                        placeholder="Enter password"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-900 text-sm"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
