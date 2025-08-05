const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  // Core References
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor' 
  },

  // Clinical Data
  visitDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: v => v <= new Date(),
      message: "Visit date cannot be in the future"
    }
  },
  symptoms: [{
    name: String,
    duration: String // e.g., "3 days"
  }],
  diagnosis: String,
  prescriptions: [{
    name: String,
    dosage: String,
    instructions: String
  }],

  // System Metadata
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true 
  },
  lastUpdated: Date
}, { timestamps: true });

// Middleware to verify doctor access
medicalRecordSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    
    if (!user || !user.authorizedDoctors?.includes(this.doctorId)) {
      throw new Error('Doctor not authorized to create medical records for this user');
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
