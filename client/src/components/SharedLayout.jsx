import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

function SharedLayout() {
    return (
        <div>
            <Toaster />
            <Navbar />
            <Outlet />
        </div>
    );
}

export default SharedLayout;
