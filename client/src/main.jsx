import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import SharedLayout from "./components/SharedLayout";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SharedLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/me" element={<ProfilePage />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
