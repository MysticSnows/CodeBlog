const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
    ,
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false
    },
    lastVisit: {
        type: Date
    }
},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
