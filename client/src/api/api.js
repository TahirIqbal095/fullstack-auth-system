import axios from "./axios";

export const CreateSession = async (email, password) => {
    try {
        const response = await axios.post(`/login`, {
            email,
            password,
        });
        return response;
    } catch (error) {
        console.error("error while login : " + error);
    }
};

export const getUserData = async () => {
    try {
        const response = await axios.get("/profile");
        return response;
    } catch (err) {
        console.error("error while fetching user data : ", err);
    }
};

export const createUser = async (user) => {
    try {
        const response = await axios.post("/signup", {
            name: user.name,
            email: user.email,
            password: user.password,
        });

        return response;
    } catch (err) {
        console.error("error while create user : ", err);
    }
};
