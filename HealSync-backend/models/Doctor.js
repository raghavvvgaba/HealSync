const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },  // References User.uid
  email: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  specialisation: { type: String, required: true },
  hospitalClinicName: { type: String },
  city: { type: String }
}, { timestamps: true });

// Middleware to ensure only users with doctor role can create doctor profiles
doctorSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const user = await User.findOne({ uid: this.uid });
    
    if (!user || user.role !== 'doctor') {
      throw new Error('Only users with doctor role can create doctor profiles');
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);
