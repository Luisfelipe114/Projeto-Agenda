const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

const userModel = mongoose.model('usuarios', userSchema) //retorna uma promise

exports.userSchema = userSchema;
exports.userModel = userModel;