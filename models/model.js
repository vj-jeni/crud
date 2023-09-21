const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema

const UserSchema = new Schema ({
    user_name: {
        type: String, 
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    journey: {
        type: String,
        enum: ['CORPORATE', 'INSTITUTE', 'STUDENT'],
        required: true
    }
})

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
  };

module.exports = mongoose.model('User', UserSchema);