const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models/db");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password, done) {
            User.findOne({ email })
                .then(async (user) => {
                    if (!user) {
                        done(null, false, {
                            message: "Invalid email",
                        });
                        return;
                    }

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!passwordMatch) {
                        done(null, false, {
                            message: "Incorrect password.",
                        });
                        return;
                    }

                    done(null, user, { message: "login successfull" });
                    return;
                })
                .catch((err) => done(err));
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "http://localhost:3000/api/v1/user/google/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const existingUser = await User.find({ googleId: profile.id });
                if (existingUser) {
                    done(null, existingUser);
                    return;
                }

                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });

                await newUser.save();
                done(null, newUser);
            } catch (err) {
                console.error(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error);
    }
});
