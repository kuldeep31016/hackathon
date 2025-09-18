// Usage: node resetDoctorPassword.js <email or phone> <newPassword>
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');
require('dotenv').config({ path: '../.env' });

async function resetDoctorPassword(identifier, newPassword) {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  let doctor = await Doctor.findOne({ $or: [ { email: identifier }, { phone: identifier } ] });
  if (!doctor) {
    console.error('Doctor not found');
    process.exit(1);
  }
  doctor.password = await bcrypt.hash(newPassword, 12);
  doctor.isVerified = true;
  await doctor.save();
  console.log('Password reset successful for:', doctor.email || doctor.phone);
  process.exit(0);
}

const [,, identifier, newPassword] = process.argv;
if (!identifier || !newPassword) {
  console.error('Usage: node resetDoctorPassword.js <email or phone> <newPassword>');
  process.exit(1);
}
resetDoctorPassword(identifier, newPassword);