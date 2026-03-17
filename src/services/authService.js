const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (userData) => {
    const { name, email, phone, password } = userData;

    // Check if user exists by email or phone
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
        if (userExists.email === email) {
            throw new Error('User with this email already exists');
        }
        if (userExists.phone === phone) {
            throw new Error('User with this phone number already exists');
        }
    }

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password,
    });

    if (user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: signToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

const loginUser = async (email, password) => {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: signToken(user._id),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

module.exports = {
    registerUser,
    loginUser,
};
