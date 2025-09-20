const mongoose = require('mongoose');

const consultationBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  doctorId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and Number
    required: true
  },
  // Include complete doctor information for admin dashboard
  doctorDetails: {
    name: String,
    specialization: String,
    qualification: String,
    experience: Number,
    rating: Number,
    consultationFee: Number,
    avatar: String,
    languages: [String],
    totalConsultations: Number
  },
  patientDetails: {
    name: String,
    phone: String,
    age: Number,
    gender: String,
    email: String
  },
  consultationType: {
    type: String,
    enum: ['video', 'voice', 'chat'],
    required: true
  },
  specialty: String,
  appointmentTime: {
    type: Date,
    required: true
  },
  symptoms: {
    primarySymptoms: [String],
    duration: String,
    severity: String,
    description: String
  },
  consultationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ConsultationBooking', consultationBookingSchema);