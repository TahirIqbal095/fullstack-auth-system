const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const zod = require("zod");
const UserModel = require("./db");
const cors = require("cors");

const app = express();
const JWT_SECRET = "helloworld";

mongoose.connect(
    "mongodb+srv://tahiriqbal:X4ZgY9IwcVnm784H@cluster0.qn51z.mongodb.net/jwt-auth"
);

app.use(express.json());
app.use(cors());

// middleware to verify the token
function verifyToken(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        res.status(403).json({
            message: "unauthorized user",
        });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
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

    const isUser = await UserModel.findOne({
        email: email,
    });

    if (!isUser) {
        await UserModel.create({
            name: name,
            email: email,
            password: password,
        });

        res.json({
            message: "you are signed up",
        });
    } else {
        res.json({
            message: "username already exists",
        });
    }
});

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const isUser = await UserModel.findOne({
        email: email,
        password: password,
    });

    if (isUser) {
        // generate token
        const token = jwt.sign(
            {
                email: email,
            },
            JWT_SECRET
        );

        res.json({
            message: "You are logged in",
            email: email,
            token: token,
        });
    } else {
        res.json({
            message: "user doesn't exist",
        });
    }
});

app.get("/me", verifyToken, async (req, res) => {
    const email = req.user.email;

    const isUser = await UserModel.findOne({
        email: email,
    });

    if (isUser) {
        res.json({
            name: isUser?.name,
            email: isUser?.email,
        });
    } else {
        res.json({
            message: "invalid token",
            token: token,
        });
    }
});

app.get("/all", async (req, res) => {
    const users = await UserModel.find({});

    res.json({
        users,
    });
});

app.listen(3001, () => console.log("listing on port 3001"));
