import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            if (response.status === 200) {
                navigate("/me");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <h1>Sign Up page</h1>

            <form action="post">
                <div>
                    <span>Enter you name : </span>
                    <input
                        type="text"
                        name="name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <span>Enter the email : </span>
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
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

                <button onClick={handleSubmit}>Signup</button>
            </form>
        </div>
    );
}

export default Signup;
