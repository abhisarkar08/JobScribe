const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String }
    }, 
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    }
}, { timestamps: true });

const user = mongoose.model('User', userSchema);

module.exports = user;