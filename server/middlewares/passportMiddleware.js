const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(401).json({
            message: "unauthenticated user",
        });
    }
};

module.exports = isAuthenticated;
