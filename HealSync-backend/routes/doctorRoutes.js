const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Doctor profile endpoint
router.post("/profile", authenticate, async (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    const { uid } = req.user;

    try {
        const doctor = await Doctor.findOneAndUpdate(
            { uid },
            { 
                name, 
                email,
                role: 'doctor'
            },
            { upsert: true, new: true }
        );
        res.json(doctor);
    } catch (err) {
        res.status(500).json({
            message: "DB error", 
            error: err.message
        });
    }
});

// Create medical record (requires access token)
router.post("/medical-records", authenticate, async (req, res) => {
    const { userId, accessToken, symptoms, diagnosis, prescriptions, notes } = req.body;
    
    if (!userId || !accessToken || !diagnosis) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Find user and verify access token
        const user = await User.findOne({ uid: userId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if doctor is authorized
        const authorization = user.authorizedDoctors.find(
            auth => auth.doctorId === req.user.uid && 
                   auth.accessToken === accessToken &&
                   auth.expiresAt > new Date()
        );

        if (!authorization) {
            return res.status(403).json({ message: "Invalid or expired access token" });
        }

        // Create new medical record
        const newRecord = {
            doctorId: req.user.uid,
            symptoms,
            diagnosis,
            prescriptions,
            notes,
            createdAt: new Date()
        };

        user.medicalRecords.push(newRecord);
        await user.save();

        res.json(newRecord);
    } catch (err) {
        res.status(500).json({ message: "Error creating medical record", error: err.message });
    }
});

module.exports = router;
