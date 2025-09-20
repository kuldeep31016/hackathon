const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ConsultationBooking = require('../models/ConsultationBooking');
const Doctor = require('../models/Doctor');

// Create a new consultation booking
router.post('/consultations', async (req, res) => {
  try {
    console.log('📱 NEW CONSULTATION BOOKING REQUEST:');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('---');

    const {
      bookingId,
      doctorId,
      patientDetails,
      consultationType,
      specialty,
      appointmentTime,
      symptoms,
      consultationFee,
      paymentMethod,
      paymentStatus,
      status,
      notes
    } = req.body;

    // Use provided bookingId or generate one
    const finalBookingId = bookingId || 'NBH' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const booking = new ConsultationBooking({
      bookingId: finalBookingId,
      doctorId, // Can now be number or ObjectId
      patientDetails,
      consultationType,
      specialty,
      appointmentTime,
      symptoms,
      consultationFee,
      paymentMethod,
      paymentStatus: paymentStatus || 'completed',
      status: status || 'pending',
      notes
    });

    await booking.save();

    console.log('✅ Booking saved successfully:', finalBookingId);

    res.status(201).json({
      success: true,
      message: 'Consultation booking created successfully',
      booking: booking
    });

  } catch (error) {
    console.error('❌ Error creating consultation booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create consultation booking',
      error: error.message
    });
  }
});

// Get all consultation bookings (for admin dashboard)
router.get('/consultations', async (req, res) => {
  try {
    const { status, date, doctorId } = req.query;
    
    let filter = {};
    
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentTime = { $gte: startDate, $lt: endDate };
    }

    const bookings = await ConsultationBooking.find(filter)
      .populate('doctorId', 'name specialization phone email')
      .sort({ bookedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      bookings: bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Error fetching consultation bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation bookings',
      error: error.message
    });
  }
});

// Get consultation booking by ID
router.get('/consultations/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await ConsultationBooking.findOne({ bookingId })
      .populate('doctorId', 'name specialization phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Consultation booking not found'
      });
    }

    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Error fetching consultation booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation booking',
      error: error.message
    });
  }
});

// Update consultation booking status
router.patch('/consultations/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const booking = await ConsultationBooking.findOneAndUpdate(
      { bookingId },
      { 
        status,
        ...(notes && { notes })
      },
      { new: true }
    ).populate('doctorId', 'name specialization phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Consultation booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation booking status updated',
      booking: booking
    });

  } catch (error) {
    console.error('Error updating consultation booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation booking',
      error: error.message
    });
  }
});

module.exports = router;