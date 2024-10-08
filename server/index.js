require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const MONGODB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(`${MONGODB_URL}/jwt-auth`);
const UserModel = require("./db");

const app = express();

app.use([express.json(), cookieParser(), cors()]);

// middleware to verify the token
function verifyToken(req, res, next) {
    const token = req.cookies?.token;

    console.log(token);

    if (!token) {
        res.status(401).json({
            message: "unauthorized user",
        });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.user = decoded;
        next();
    });
}

app.post("/signup", async (req, res) => {
    const emailSchema = zod.string().email();
    const passwordSchema = zod.string().min(6);

    const { name, email, password } = req.body;

    const validEmail = emailSchema.safeParse(email);
    const validPassword = passwordSchema.safeParse(password);

    if (!validEmail.success || !validPassword.success) {
        res.json({
            message:
                "please provide a correct format of email and passwod should be atleast 6 characters",
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUser = await UserModel.findOne({
        email: email,
    });

    if (!isUser) {
        await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        res.json({
            message: "you are signed up",
        });
    } else {
        res.status(409).json({
            message: "username already exists",
        });
    }
});

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const isUser = await UserModel.findOne({
        email: email,
    });

    const passwordMatch = await bcrypt.compare(password, isUser?.password);

    if (isUser && passwordMatch) {
        const token = jwt.sign(
            {
                email: email,
            },
            JWT_SECRET
        );

        res.cookie("token", token, { httpOnly: true, sameSite: "None" });

        res.status(200).json({
            message: "You are logged in",
        });
    } else {
        res.status(401).json({
            message: "user doesn't exist",
        });
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

app.listen(3001, () => console.log("listing on port 3001"));
