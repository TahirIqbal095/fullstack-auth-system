const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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
                    if (!user) return done(null, false);

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!passwordMatch) {
                        return done(null, false, {
                            message: "Incorrect password.",
                        });
                    }

                    return done(null, user);
                })
                .catch((err) => done(err));
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error);
    }
});
