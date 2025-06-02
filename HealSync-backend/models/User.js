const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uid: {type: String, required: true, unique: true},
    email: String, 
    name: String,
    role: { type: String, enum:["user", "doctor"], default: "user"},

});

module.exports = mongoose.model("User", userSchema);