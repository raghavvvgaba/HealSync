const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const User = require("../models/User");

router.post("/profile", authenticate, async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("Incoming profile body:", req.body);

    const { uid } = req.user;

    try {
        const user = await User.findOneAndUpdate(
            { uid },
            { name, email, role },
            { upsert: true, new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: "DB error", error: err.message
        });
    }
})

module.exports = router;