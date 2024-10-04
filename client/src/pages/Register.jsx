import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Register() {
    const [switchForm, setSwitchForm] = useState(false);

    const handleSwitch = () => {
        setSwitchForm((prev) => !prev);
    };
    return (
        <>
            <div>
                {switchForm ? <Login /> : <Signup />}

                {switchForm ? (
                    <button onClick={handleSwitch}>Signup</button>
                ) : (
                    <button onClick={handleSwitch}>Login</button>
                )}
            </div>
        </>
    );
}

export default Register;
