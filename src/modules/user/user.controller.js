const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const { catchError } = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");
const prisma = new PrismaClient();


// Register function with Prisma
const register = catchError(async (req, res, next) => {
    const { userName, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user with Prisma
    const user = await prisma.user.create({
        data: {
            userName,
            email,
            password: hashedPassword,
        },
    });

    res.json(user);
});

// Login function with Prisma
const login = catchError(async (req, res, next) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    // Check if user exists and password matches
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = JWT.sign({ userId: user.id }, process.env.JWT_KEY);
        return res.json({ token });
    }

    next(new apiError("email or password incorrect", 401));
});

// Protect routes with Prisma
const protectRoutes = catchError(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return next(new apiError("Token not provided", 401));

    const token = authorization.replace("Bearer ", "");

    try {
        const decoded = JWT.verify(token, process.env.JWT_KEY);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) return next(new apiError("User not found", 404));

        // Check if the user has logged out since the token was issued
        if (user.logoutAt) {
            const logoutTime = Math.floor(new Date(user.logoutAt).getTime() / 1000);
            if (logoutTime > decoded.iat) {
                return next(new apiError("Invalid token. Please log in again", 401));
            }
        }

        req.user = user;
        next();
    } catch (err) {
        next(new apiError("Invalid token. Please log in again", 401));
    }
});

module.exports = {
    register,
    login,
    protectRoutes
};
