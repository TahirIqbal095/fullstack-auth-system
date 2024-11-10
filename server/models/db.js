const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserModel = new Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

UserModel.pre("save", function checkPassword(next) {
    const user = this;

    if (!user.isModified("password")) {
        next();
        return;
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            next(err);
            return;
        }
        bcrypt.hash(user.password, salt, (innerErr, hash) => {
            if (innerErr) {
                next(innerErr);
                return;
            }
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model("User", UserModel);

module.exports = {
    User,
};
