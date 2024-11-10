require("dotenv").config();

const { Router } = require("express");
const passport = require("passport");
const { User } = require("../models/db");
const zod = require("zod");

const userAuthRouter = Router();

userAuthRouter.post("/signup", async (req, res) => {
    const emailSchema = zod.string().email();
    const passwordSchema = zod.string().min(6);

    const { name, email, password } = req.body;

    const validEmail = emailSchema.safeParse(email);
    const validPassword = passwordSchema.safeParse(password);

    if (!validEmail.success || !validPassword.success) {
        return res.status(400).json({
            message: "Please provide a valid email and password",
        });
    }

    const isUser = await User.findOne({
        email: email,
    });

    if (isUser) {
        res.status(409).json({
            message: "email already exists",
        });

        return;
    }

    const user = new User({
        name,
        email,
        password,
    });

    await user.save();

    req.logIn(user, (innerError) => {
        if (innerError) {
            next(innerError);
            res.status(501).json({
                error: "failed to login",
            });
            return;
        }

        res.json({
            name: user.name,
            email: user.email,
        });
    });
});

userAuthRouter.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/api/v1/user/me",
        failureRedirect: "api/v1/user/login-failure",
    })
);

userAuthRouter.get("/login-failure", (req, res) => {
    res.json({
        message: "login failed",
    });
});

userAuthRouter.get("/me", async (req, res) => {
    const email = req.user?.email;

    if (!email) {
        res.status(401).json({
            message: "unauthorized user",
        });
        return;
    }
    const isUser = await User.findOne({
        email: email,
    });

    if (!isUser) {
        return res.status(401).json({
            message: "invalid token",
            token: token,
        });
    }

    res.status(200).json({
        message: "user authenticated",
        user: isUser,
    });
});

userAuthRouter.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
    });
    res.json({
        message: "you logged out",
    });
});

module.exports = {
    userAuthRouter,
};
