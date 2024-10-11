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
            <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
                <div className="">{switchForm ? <Login /> : <Signup />}</div>
                <div className="mt-6">
                    {switchForm ? (
                        <button onClick={handleSwitch} className="">
                            Signup{" "}
                        </button>
                    ) : (
                        <button onClick={handleSwitch}>Login</button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Register;
