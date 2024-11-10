require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { userAuthRouter } = require("./routes/auth");
const passport = require("passport");

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();
require("./config/passport");

app.use([
    express.json(),
    express.urlencoded({ extended: true }),
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
]);

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.DATABASE_URL,
            collectionName: "sessions",
            autoRemove: "native",
        }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 5, // 5 min
        },
    })
);

// initialize passport and setting up session for persistent login
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user/", userAuthRouter);

async function main() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        const options = {
            key: fs.readFileSync("localhost-key.pem"),
            cert: fs.readFileSync("localhost.pem"),
        };
        https
            .createServer(options, app)
            .listen(3000, () =>
                console.log("https server running on port 3000")
            );
    } catch (error) {
        console.error("error while connecting to database", error);
    }
}

main();
