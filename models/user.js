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
    // nickname: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
