const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Firebase-managed fields
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ["user", "doctor"], default: "user" },
  
  // Doctor Access Management
  authorizedDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  
  // Profile structure
  profile: {
    // 1. Essential/Basic Info (Required)
    basic: {
      fullName: { type: String, required: true },
      dob: { type: Date, required: true },
      gender: { 
        type: String, 
        enum: ["male", "female", "non-binary", "prefer-not-to-say", null],
        default: null 
      },
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", null],
        default: null
      },
      height: {
        value: { type: Number },
        unit: { type: String, enum: ["cm", "ft"], default: "cm" }
      },
      weight: {
        value: { type: Number },
        unit: { type: String, enum: ["kg", "lbs"], default: "kg" }
      },
      contactNumber: { type: String },
      emergencyContact: {
        name: { type: String },
        number: { type: String },
        relation: { type: String }
      }
    },
    
    // 2. Medical Context (Optional)
    medical: {
      chronicConditions: [{ 
        name: String,
        diagnosedDate: Date 
      }],
      allergies: [{
        type: { type: String, enum: ["drug", "food", "environmental", "other"] },
        name: String,
        severity: { type: String, enum: ["mild", "moderate", "severe"] }
      }],
      currentMedications: [{
        name: String,
        dosage: String,
        frequency: String
      }],
      disabilities: [{
        type: String,
        requiresAid: Boolean,
        aidDescription: String
      }],
      vision: {
        leftEye: String,  // e.g., "-2.50"
        rightEye: String,
        wearsGlasses: Boolean
      },
      hearingAids: Boolean
    },
    
    // 3. Lifestyle (Optional)
    lifestyle: {
      smoking: { 
        type: String, 
        enum: ["never", "former", "occasional", "regular", null],
        default: null 
      },
      alcohol: {
        type: String,
        enum: ["never", "occasional", "regular", null],
        default: null
      },
      exerciseFrequency: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very-active", null],
        default: null
      },
      dietaryPreferences: [{
        type: String,
        enum: ["vegetarian", "vegan", "gluten-free", "halal", "kosher", "dairy-free", "nut-free", "other"]
      }]
    },
    
    // Metadata
    profileCompleted: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  }
}, { timestamps: true });

// Virtual for age calculation
userSchema.virtual("profile.basic.age").get(function() {
  if (!this.profile?.basic?.dob) return null;
  const diff = Date.now() - this.profile.basic.dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

module.exports = mongoose.model("User", userSchema);
