const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const User = require("../models/User");
const crypto = require('crypto');

router.post("/signup", authenticate, async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("Incoming signup body:", req.body);

    const { uid } = req.user;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        // Create new user
        const newUser = await User.create({ uid, name, email, role });
        res.status(201).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "DB error", error: err.message
        });
    }
})

// Generate access token for doctor
router.post("/access-grants", authenticate, async (req, res) => {
    const { doctorId } = req.body;
    const duration = 10; // duration in minutes
    if (!doctorId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const user = await User.findOne({ uid: req.user.uid });
        const accessToken = crypto.randomBytes(32).toString('hex');
        const expiryDate = new Date(Date.now() + duration * 60 * 1000); // duration in minutes

        // Add doctor to authorized list with access token
        user.authorizedDoctors.push({
            doctorId,
            accessToken,
            expiresAt: expiryDate
        });

        await user.save();
        res.json({ accessToken, expiresAt: expiryDate });
    } catch (err) {
        res.status(500).json({ message: "Error generating access token", error: err.message });
    }
});

// Get all medical records
router.get("/medical-records", authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid })
            .populate('medicalRecords');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.medicalRecords);
    } catch (err) {
        res.status(500).json({ message: "Error fetching records", error: err.message });
    }
});

// Get user's onboarding status
router.get("/onboarding-status", authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check all required fields from the schema
        const hasRequiredBasicInfo = !!(
            user.profile?.basic?.fullName &&
            user.profile?.basic?.dob &&
            user.profile?.basic?.gender &&
            user.profile?.basic?.bloodGroup &&
            user.profile?.basic?.height?.value &&
            user.profile?.basic?.height?.unit &&
            user.profile?.basic?.weight?.value &&
            user.profile?.basic?.weight?.unit
        );

        // Check optional fields
        const optionalFields = [
            'contactNumber',
            'emergencyContact'
        ];

        const completedOptionalFields = optionalFields.filter(
            field => !!user.profile?.basic?.[field]
        );

        res.json({
            profileCompleted: user.profile?.profileCompleted || false,
            hasRequiredBasicInfo,
            missingRequiredFields: !hasRequiredBasicInfo ? [
                ...(!user.profile?.basic?.fullName ? ['fullName'] : []),
                ...(!user.profile?.basic?.dob ? ['dob'] : []),
                ...(!user.profile?.basic?.gender ? ['gender'] : []),
                ...(!user.profile?.basic?.bloodGroup ? ['bloodGroup'] : []),
                ...(!user.profile?.basic?.height?.value || !user.profile?.basic?.height?.unit ? ['height'] : []),
                ...(!user.profile?.basic?.weight?.value || !user.profile?.basic?.weight?.unit ? ['weight'] : [])
            ] : [],
            completedOptionalFields,
            medicalInfoProvided: Object.keys(user.profile?.medical || {}).length > 0,
            lifestyleInfoProvided: Object.keys(user.profile?.lifestyle || {}).length > 0,
            lastUpdated: user.profile?.lastUpdated
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching onboarding status", error: err.message });
    }
});

// Submit initial onboarding information (basic required info)
router.post("/onboarding", authenticate, async (req, res) => {
    try {
        const { basic } = req.body;
        
        // Validate all required basic information
        if (!basic?.fullName || !basic?.dob || !basic?.gender || !basic?.bloodGroup || 
            !basic?.height || !basic?.weight) {
            return res.status(400).json({
                message: "Missing required basic information",
                required: ["fullName", "dob", "gender", "bloodGroup", "height", "weight"]
            });
        }

        // Validate gender
        if (!["male", "female", "non-binary", "prefer-not-to-say"].includes(basic.gender)) {
            return res.status(400).json({ message: "Invalid gender value" });
        }

        // Validate blood group
        if (!["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].includes(basic.bloodGroup)) {
            return res.status(400).json({ message: "Invalid blood group" });
        }

        // Validate height (required)
        if (!basic.height.value || !["cm", "ft"].includes(basic.height.unit)) {
            return res.status(400).json({ message: "Invalid height format. Must include value and unit (cm/ft)" });
        }

        // Validate weight (required)
        if (!basic.weight.value || !["kg", "lbs"].includes(basic.weight.unit)) {
            return res.status(400).json({ message: "Invalid weight format. Must include value and unit (kg/lbs)" });
        }

        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update basic profile information
        user.profile = {
            ...user.profile,
            basic,
            profileCompleted: true,
            lastUpdated: new Date()
        };

        await user.save();
        res.json({
            message: "Basic profile information saved successfully",
            profile: user.profile
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error saving basic information", 
            error: err.message 
        });
    }
});

// Update profile sections (medical and lifestyle)
router.patch("/profile", authenticate, async (req, res) => {
    try {
        const { medical, lifestyle } = req.body;
        
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate medical information if provided
        if (medical) {
            // Validate chronic conditions
            if (medical.chronicConditions) {
                medical.chronicConditions.forEach(condition => {
                    if (!condition.name || !condition.diagnosedDate) {
                        throw new Error("Invalid chronic condition format");
                    }
                });
            }

            // Validate allergies
            if (medical.allergies) {
                medical.allergies.forEach(allergy => {
                    if (!["drug", "food", "environmental", "other"].includes(allergy.type) ||
                        !allergy.name ||
                        !["mild", "moderate", "severe"].includes(allergy.severity)) {
                        throw new Error("Invalid allergy format");
                    }
                });
            }

            // Validate medications
            if (medical.currentMedications) {
                medical.currentMedications.forEach(med => {
                    if (!med.name || !med.dosage || !med.frequency) {
                        throw new Error("Invalid medication format");
                    }
                });
            }
        }

        // Validate lifestyle information if provided
        if (lifestyle) {
            if (lifestyle.smoking && 
                !["never", "former", "occasional", "regular"].includes(lifestyle.smoking)) {
                throw new Error("Invalid smoking status");
            }

            if (lifestyle.alcohol && 
                !["never", "occasional", "regular"].includes(lifestyle.alcohol)) {
                throw new Error("Invalid alcohol consumption status");
            }

            if (lifestyle.exerciseFrequency && 
                !["sedentary", "light", "moderate", "active", "very-active"].includes(lifestyle.exerciseFrequency)) {
                throw new Error("Invalid exercise frequency");
            }

            if (lifestyle.dietaryPreferences) {
                const validPreferences = [
                    "vegetarian", "vegan", "gluten-free", "halal", 
                    "kosher", "dairy-free", "nut-free", "other"
                ];
                lifestyle.dietaryPreferences.forEach(pref => {
                    if (!validPreferences.includes(pref)) {
                        throw new Error("Invalid dietary preference");
                    }
                });
            }
        }

        // Update provided sections
        if (medical) {
            user.profile.medical = { 
                ...user.profile.medical, 
                ...medical 
            };
        }
        
        if (lifestyle) {
            user.profile.lifestyle = { 
                ...user.profile.lifestyle, 
                ...lifestyle 
            };
        }

        user.profile.lastUpdated = new Date();
        await user.save();

        res.json({
            message: "Profile updated successfully",
            profile: user.profile
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error updating profile", 
            error: err.message 
        });
    }
});

module.exports = router;