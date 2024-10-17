require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const https = require("https");

const MONGODB_URL = process.env.DATABASE_URL;
const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

mongoose.connect(`${MONGODB_URL}/jwt-auth`);
const UserModel = require("./db");

const app = express();

app.use([
    express.json(),
    cookieParser(),
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        exposedHeaders: ["authorization"],
    }),
]);

// middleware to verify the token
function verifyToken(req, res, next) {
    const token = req.cookies?.accessToken;

    if (!token) {
        res.status(401).json({
            message: "unauthorized user",
        });
        return;
    }

    jwt.verify(token, JWT_SECRET_ACCESS, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.user = decoded;
        next();
    });
}

// function to generate the refresh and access token
function generateAccessToken(user) {
    const accessToken = jwt.sign(
        {
            email: user.email,
        },
        JWT_SECRET_ACCESS,
        { expiresIn: "1m" }
    );

    return accessToken;
}

function generateRefreshToken(user) {
    const refreshToken = jwt.sign(
        {
            email: user.email,
        },
        JWT_SECRET_REFRESH,
        { expiresIn: "5m" }
    );

    return refreshToken;
}

app.get("/refresh", (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        res.status(401).json({
            message: "unauthorized user",
        });

        return;
    }

    jwt.verify(token, JWT_SECRET_REFRESH, (err, decoded) => {
        if (err) {
            res.status(401).json({
                message: "invalid token",
            });

            return;
        } else {
            const accessToken = generateAccessToken(decoded);

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                httpOnly: true,
                path: "/",
                secure: true,
                sameSite: "none",
            });
            res.status(200).json({
                message: "New access token generated successfully",
            });
        }
    });
});

app.post("/signup", async (req, res) => {
    const emailSchema = zod.string().email();
    const passwordSchema = zod.string().min(6);

    const { name, email, password } = req.body;

    const validEmail = emailSchema.safeParse(email);
    const validPassword = passwordSchema.safeParse(password);

    if (!validEmail.success || !validPassword.success) {
        res.status(400).json({
            message: "Please provide a valid email and password",
        });
        return;
    }

    const isUser = await UserModel.findOne({
        email: email,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!isUser) {
        await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const accessToken = generateAccessToken({
            email: email,
        });
        const refreshToken = generateRefreshToken({
            email: email,
        });

        res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "none",
        });
        res.cookie("accessToken", accessToken, {
            domain: "localhost",
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "none",
        });

        res.status(200).json({
            message: "account created successfully",
        });
    } else {
        res.status(409).json({
            message: "email already exists",
        });
    }
});

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
    });

    if (!user) {
        res.status(404).json({
            message: "user doesn't exist",
        });

        return;
    }

    try {
        const passwordMatch = await bcrypt.compare(password, user?.password);
        if (user && passwordMatch) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                httpOnly: true,
                path: "/",
                secure: true,
                sameSite: "none",
            });
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                httpOnly: true,
                path: "/",
                secure: true,
                sameSite: "none",
            });

            res.status(200).json({
                message: "Login successful",
            });
        } else {
            res.status(401).json({
                message: "wrong email or password",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "something went wrong, please try again",
        });

        return;
    }
});

app.get("/me", verifyToken, async (req, res) => {
    const email = req?.user?.email;

    const isUser = await UserModel.findOne({
        email: email,
    });

    if (isUser) {
        res.json({
            name: isUser?.name,
            email: isUser?.email,
        });
    } else {
        res.status(401).json({
            message: "invalid token",
            token: token,
        });
    }
});

const options = {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem"),
};

https
    .createServer(options, app)
    .listen(3000, () => console.log("https server running on port 3000"));
