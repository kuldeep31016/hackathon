import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Linking,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ConfirmationScreen = ({ 
  language, 
  doctor, 
  consultationType, 
  paymentDetails, 
  personalDetails,
  symptoms,
  onClose 
}) => {
  // Generate booking ID immediately when component initializes
  const generateBookingId = () => {
    const prefix = 'NBH';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  

  const [bookingId, setBookingId] = useState(() => {
    const generatedId = generateBookingId();
    console.log('🆔 Initial booking ID generated:', generatedId);
    return generatedId;
  });
  const [appointmentTime, setAppointmentTime] = useState(new Date().toLocaleString());
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  console.log('🔍 Component render - bookingId:', bookingId);
  
  // Debug: Log all props to see what data we're receiving
  console.log('🔍 DEBUG - Props received by ConfirmationScreen:');
  console.log('  - doctor:', doctor);
  console.log('  - personalDetails:', personalDetails);
  console.log('  - consultationType:', consultationType);
  console.log('  - paymentDetails:', paymentDetails);
  console.log('  - symptoms:', symptoms);

  const translations = {
    en: {
      title: 'Consultation Confirmed!',
      subtitle: 'Your consultation has been successfully booked',
      bookingId: 'Booking ID',
      appointmentDetails: 'Appointment Details',
      doctorName: 'Doctor',
      specialization: 'Specialization',
      consultationType: 'Consultation Type',
      appointmentTime: 'Appointment Time',
      consultationFee: 'Consultation Fee',
      paymentMethod: 'Payment Method',
      patientDetails: 'Patient Details',
      patientName: 'Patient Name',
      age: 'Age',
      gender: 'Gender',
      phone: 'Phone',
      symptoms: 'Symptoms',
      nextSteps: 'Next Steps',
      joinCall: 'Join Video Call',
      joinVoice: 'Join Voice Call',
      openChat: 'Open Chat',
      downloadReceipt: 'Download Receipt',
      shareDetails: 'Share Details',
      addToCalendar: 'Add to Calendar',
      viewPrescription: 'View Prescription',
      bookAnother: 'Book Another Consultation',
      goHome: 'Go to Dashboard',
      helpSupport: 'Help & Support',
      callDoctor: 'Call Doctor',
      reschedule: 'Reschedule',
      cancel: 'Cancel Appointment',
      rateExperience: 'Rate Your Experience',
      submitRating: 'Submit Rating',
      thankYou: 'Thank you for your feedback!',
      instructions: 'Important Instructions',
      instruction1: '• Join the call 5 minutes before appointment time',
      instruction2: '• Keep your medical documents ready',
      instruction3: '• Ensure stable internet connection',
      instruction4: '• Find a quiet, well-lit space for video call',
      reminder: 'You will receive a reminder 15 minutes before your appointment',
      emergency: 'For medical emergencies, call 102',
      videoCall: 'Video Call',
      voiceCall: 'Voice Call',
      chat: 'Chat',
      schedule: 'Scheduled',
    },
    hi: {
      title: 'परामर्श की पुष्टि हो गई!',
      subtitle: 'आपका परामर्श सफलतापूर्वक बुक हो गया है',
      bookingId: 'बुकिंग आईडी',
      appointmentDetails: 'अपॉइंटमेंट विवरण',
      doctorName: 'डॉक्टर',
      specialization: 'विशेषज्ञता',
      consultationType: 'परामर्श प्रकार',
      appointmentTime: 'अपॉइंटमेंट समय',
      consultationFee: 'परामर्श शुल्क',
      paymentMethod: 'भुगतान विधि',
      patientDetails: 'रोगी विवरण',
      patientName: 'रोगी का नाम',
      age: 'उम्र',
      gender: 'लिंग',
      phone: 'फोन',
      symptoms: 'लक्षण',
      nextSteps: 'अगले कदम',
      joinCall: 'वीडियो कॉल में शामिल हों',
      joinVoice: 'वॉयस कॉल में शामिल हों',
      openChat: 'चैट खोलें',
      downloadReceipt: 'रसीद डाउनलोड करें',
      shareDetails: 'विवरण साझा करें',
      addToCalendar: 'कैलेंडर में जोड़ें',
      viewPrescription: 'नुस्खा देखें',
      bookAnother: 'दूसरा परामर्श बुक करें',
      goHome: 'डैशबोर्ड पर जाएं',
      helpSupport: 'सहायता और समर्थन',
      callDoctor: 'डॉक्टर को कॉल करें',
      reschedule: 'पुनर्निर्धारण',
      cancel: 'अपॉइंटमेंट रद्द करें',
      rateExperience: 'अपने अनुभव को रेट करें',
      submitRating: 'रेटिंग सबमिट करें',
      thankYou: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
      instructions: 'महत्वपूर्ण निर्देश',
      instruction1: '• अपॉइंटमेंट समय से 5 मिनट पहले कॉल में शामिल हों',
      instruction2: '• अपने मेडिकल दस्तावेज़ तैयार रखें',
      instruction3: '• स्थिर इंटरनेट कनेक्शन सुनिश्चित करें',
      instruction4: '• वीडियो कॉल के लिए शांत, अच्छी रोशनी वाली जगह खोजें',
      reminder: 'आपको अपॉइंटमेंट से 15 मिनट पहले रिमाइंडर मिलेगा',
      emergency: 'मेडिकल इमरजेंसी के लिए 102 पर कॉल करें',
      videoCall: 'वीडियो कॉल',
      voiceCall: 'वॉयस कॉल',
      chat: 'चैट',
      schedule: 'निर्धारित',
    },
    pa: {
      title: 'ਸਲਾਹ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਗਈ!',
      subtitle: 'ਤੁਹਾਡੀ ਸਲਾਹ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋ ਗਈ ਹੈ',
      bookingId: 'ਬੁਕਿੰਗ ID',
      appointmentDetails: 'ਮੁਲਾਕਾਤ ਵੇਰਵੇ',
      doctorName: 'ਡਾਕਟਰ',
      specialization: 'ਵਿਸ਼ੇਸ਼ਤਾ',
      consultationType: 'ਸਲਾਹ ਦੀ ਕਿਸਮ',
      appointmentTime: 'ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ',
      consultationFee: 'ਸਲਾਹ ਫੀਸ',
      paymentMethod: 'ਭੁਗਤਾਨ ਤਰੀਕਾ',
      patientDetails: 'ਮਰੀਜ਼ ਦੇ ਵੇਰਵੇ',
      patientName: 'ਮਰੀਜ਼ ਦਾ ਨਾਮ',
      age: 'ਉਮਰ',
      gender: 'ਲਿੰਗ',
      phone: 'ਫੋਨ',
      symptoms: 'ਲੱਛਣ',
      nextSteps: 'ਅਗਲੇ ਕਦਮ',
      joinCall: 'ਵੀਡੀਓ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
      joinVoice: 'ਵੌਇਸ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
      openChat: 'ਚੈਟ ਖੋਲ੍ਹੋ',
      downloadReceipt: 'ਰਸੀਦ ਡਾਊਨਲੋਡ ਕਰੋ',
      shareDetails: 'ਵੇਰਵੇ ਸਾਂਝੇ ਕਰੋ',
      addToCalendar: 'ਕੈਲੰਡਰ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
      viewPrescription: 'ਨੁਸਖਾ ਦੇਖੋ',
      bookAnother: 'ਹੋਰ ਸਲਾਹ ਬੁੱਕ ਕਰੋ',
      goHome: 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਜਾਓ',
      helpSupport: 'ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ',
      callDoctor: 'ਡਾਕਟਰ ਨੂੰ ਕਾਲ ਕਰੋ',
      reschedule: 'ਮੁੜ ਨਿਰਧਾਰਣ',
      cancel: 'ਮੁਲਾਕਾਤ ਰੱਦ ਕਰੋ',
      rateExperience: 'ਆਪਣੇ ਤਜ਼ਰਬੇ ਨੂੰ ਰੇਟ ਕਰੋ',
      submitRating: 'ਰੇਟਿੰਗ ਜਮ੍ਹਾਂ ਕਰੋ',
      thankYou: 'ਤੁਹਾਡੇ ਫੀਡਬੈਕ ਲਈ ਧੰਨਵਾਦ!',
      instructions: 'ਮਹੱਤਵਪੂਰਨ ਨਿਰਦੇਸ਼',
      instruction1: '• ਮੁਲਾਕਾਤ ਦੇ ਸਮੇਂ ਤੋਂ 5 ਮਿੰਟ ਪਹਿਲਾਂ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
      instruction2: '• ਆਪਣੇ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਰੱਖੋ',
      instruction3: '• ਸਥਿਰ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਯਕੀਨੀ ਬਣਾਓ',
      instruction4: '• ਵੀਡੀਓ ਕਾਲ ਲਈ ਸ਼ਾਂਤ, ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਾਲੀ ਜਗ੍ਹਾ ਲੱਭੋ',
      reminder: 'ਤੁਹਾਨੂੰ ਮੁਲਾਕਾਤ ਤੋਂ 15 ਮਿੰਟ ਪਹਿਲਾਂ ਰਿਮਾਈਂਡਰ ਮਿਲੇਗਾ',
      emergency: 'ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਲਈ 102 ਤੇ ਕਾਲ ਕਰੋ',
      videoCall: 'ਵੀਡੀਓ ਕਾਲ',
      voiceCall: 'ਵੌਇਸ ਕਾਲ',
      chat: 'ਚੈਟ',
      schedule: 'ਨਿਰਧਾਰਿਤ',
    },
  };

  const t = translations[language];

  // Debug log to check bookingId state
  console.log('🔍 Current bookingId state:', bookingId);

  const saveBookingToBackend = async () => {
    try {
      // Use the booking ID from state (already generated in useEffect)
      const currentBookingId = bookingId;
      
      if (!currentBookingId) {
        console.log('⚠️ No booking ID available yet');
        return;
      }

      console.log('🆔 Using booking ID for backend:', currentBookingId);
      console.log('🔍 DEBUG - Raw props before processing:');
      console.log('  - doctor object:', JSON.stringify(doctor, null, 2));
      console.log('  - personalDetails object:', JSON.stringify(personalDetails, null, 2));

      const bookingData = {
        bookingId: currentBookingId,
        doctorId: doctor?._id || doctor?.id,
        // Include complete doctor information
        doctorDetails: {
          name: doctor?.name || 'Unknown Doctor',
          specialization: doctor?.specialization || doctor?.specialty || 'General Medicine',
          qualification: doctor?.education || doctor?.qualification || 'MBBS',
          experience: doctor?.experience || 0,
          rating: doctor?.rating || 0,
          consultationFee: doctor?.fees?.[consultationType?.toLowerCase()] || doctor?.consultationFee || 500,
          avatar: doctor?.avatar || doctor?.profileImage || null,
          languages: doctor?.languages || ['English'],
          totalConsultations: doctor?.totalConsultations || 0
        },
        patientDetails: {
          name: personalDetails?.name || 'Patient',
          phone: personalDetails?.phone || '',
          age: parseInt(personalDetails?.age) || 0,
          gender: personalDetails?.gender || '',
          email: personalDetails?.email || ''
        },
        consultationType: consultationType?.toLowerCase() || 'video',
        specialty: doctor?.specialty || doctor?.specialization || 'General Medicine',
        appointmentTime: new Date(),
        symptoms: {
          primarySymptoms: symptoms?.symptoms || symptoms?.selectedSymptoms || [],
          duration: symptoms?.duration || '',
          severity: symptoms?.severity || '',
          description: symptoms?.description || ''
        },
        consultationFee: parseFloat(paymentDetails?.amount) || 500,
        paymentMethod: paymentDetails?.method || 'UPI',
        paymentStatus: 'completed',
        status: 'confirmed'
      };

      console.log('Sending booking data to backend:', bookingData);

      // Try multiple URLs for mobile device connectivity (first function)
      const apiUrls = [
        'http://192.168.1.35:3001/api/consultations',  // Current network IP
        'http://192.168.1.5:3001/api/consultations',   // Previous network IP  
        'http://localhost:3001/api/consultations'       // Localhost fallback
      ];

      let response;
      let lastError;

      for (const url of apiUrls) {
        try {
          console.log('🔄 Trying URL (first function):', url);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
          });
          
          if (response.ok) {
            console.log('✅ Connected successfully to:', url);
            break;
          } else {
            console.log('❌ Failed with status:', response.status, 'for URL:', url);
          }
        } catch (error) {
          console.log('❌ Network error for URL:', url, error.message);
          lastError = error;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All API endpoints failed');
      }

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Booking saved successfully:', result);
        console.log('✅ Booking ID confirmed:', currentBookingId);
      } else {
        console.error('❌ Failed to save booking:', response.status);
      }
    } catch (error) {
      console.error('❌ Error saving booking to backend:', error);
    }
  };

  useEffect(() => {
    // Use the booking ID that was already generated during component initialization
    console.log('🆔 useEffect - Using existing booking ID:', bookingId);
    
    // Save to backend with the existing booking ID
    saveBookingToBackendWithId(bookingId);
  }, []);

  const saveBookingToBackendWithId = async (bookingIdToUse) => {
    try {
      console.log('🆔 Using booking ID for backend:', bookingIdToUse);
      console.log('🔍 DEBUG - Raw props before processing:');
      console.log('  - doctor object:', JSON.stringify(doctor, null, 2));
      console.log('  - personalDetails object:', JSON.stringify(personalDetails, null, 2));

      const bookingData = {
        bookingId: bookingIdToUse,
        doctorId: doctor?._id || doctor?.id,
        // Include complete doctor information
        doctorDetails: {
          name: doctor?.name || 'Unknown Doctor',
          specialization: doctor?.specialization || doctor?.specialty || 'General Medicine',
          qualification: doctor?.education || doctor?.qualification || 'MBBS',
          experience: doctor?.experience || 0,
          rating: doctor?.rating || 0,
          consultationFee: doctor?.fees?.[consultationType?.toLowerCase()] || doctor?.consultationFee || 500,
          avatar: doctor?.avatar || doctor?.profileImage || null,
          languages: doctor?.languages || ['English'],
          totalConsultations: doctor?.totalConsultations || 0
        },
        patientDetails: {
          name: personalDetails?.name || 'Patient',
          phone: personalDetails?.phone || '',
          age: parseInt(personalDetails?.age) || 0,
          gender: personalDetails?.gender || '',
          email: personalDetails?.email || ''
        },
        consultationType: consultationType?.toLowerCase() || 'video',
        specialty: doctor?.specialty || doctor?.specialization || 'General Medicine',
        appointmentTime: new Date(),
        symptoms: {
          primarySymptoms: symptoms?.symptoms || symptoms?.selectedSymptoms || [],
          duration: symptoms?.duration || '',
          severity: symptoms?.severity || '',
          description: symptoms?.description || ''
        },
        consultationFee: parseFloat(paymentDetails?.amount) || 500,
        paymentMethod: paymentDetails?.method || 'UPI',
        paymentStatus: 'completed',
        status: 'confirmed'
      };

      console.log('Sending booking data to backend:', bookingData);

      // Try multiple URLs for mobile device connectivity
      const apiUrls = [
        'http://192.168.1.35:3001/api/consultations',  // Current network IP
        'http://192.168.1.5:3001/api/consultations',   // Previous network IP  
        'http://localhost:3001/api/consultations'       // Localhost fallback
      ];

      let response;
      let lastError;

      for (const url of apiUrls) {
        try {
          console.log('🔄 Trying URL:', url);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
          });
          
          if (response.ok) {
            console.log('✅ Connected successfully to:', url);
            break;
          } else {
            console.log('❌ Failed with status:', response.status, 'for URL:', url);
          }
        } catch (error) {
          console.log('❌ Network error for URL:', url, error.message);
          lastError = error;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All API endpoints failed');
      }

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Booking saved successfully:', result);
        console.log('✅ Booking ID confirmed:', bookingIdToUse);
      } else {
        console.error('❌ Failed to save booking:', response.status);
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
      }
    } catch (error) {
      console.error('❌ Error saving booking to backend:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Doctor object was:', doctor);
      console.error('❌ PersonalDetails object was:', personalDetails);
      console.error('❌ ConsultationType was:', consultationType);
      console.error('❌ PaymentDetails was:', paymentDetails);
      console.error('❌ Symptoms was:', symptoms);
      
      // Show user-friendly error message
      Alert.alert(
        'Booking Error',
        `There was an issue saving your booking: ${error.message}. Please check your internet connection and try again.`,
        [{ text: 'OK' }]
      );
    }
  };

  const getConsultationTypeText = () => {
    switch (consultationType) {
      case 'video': return t.videoCall;
      case 'voice': return t.voiceCall;
      case 'chat': return t.chat;
      case 'schedule': return t.schedule;
      default: return consultationType;
    }
  };

  const handleJoinConsultation = () => {
    Alert.alert(
      'Join Consultation',
      `Would you like to join your ${getConsultationTypeText().toLowerCase()} consultation with ${doctor?.name}?`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Join Now', onPress: () => {
          // Simulate joining consultation
          Alert.alert('Connecting...', 'Connecting you to the consultation room');
        }}
      ]
    );
  };

  const handleDownloadReceipt = () => {
    Alert.alert('Receipt', 'Receipt downloaded successfully!');
  };

  const handleShareDetails = async () => {
    try {
      const message = `
Consultation Booked Successfully!

Booking ID: ${bookingId}
Doctor: ${doctor?.name}
Specialization: ${doctor?.specialization}
Type: ${getConsultationTypeText()}
Time: ${appointmentTime}
Fee: ₹${paymentDetails?.amount}

Download Nabha Health App for more features.
      `;
      
      await Share.share({
        message,
        title: 'Consultation Details'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCalendar = () => {
    Alert.alert('Calendar', 'Event added to your calendar successfully!');
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This will call emergency services (102). Continue only for medical emergencies.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 102', onPress: () => Linking.openURL('tel:102') }
      ]
    );
  };

  const handleReschedule = () => {
    Alert.alert('Reschedule', 'Redirecting to reschedule options...');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? Refund will be processed within 3-5 business days.',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        { text: 'Cancel Appointment', style: 'destructive', onPress: () => {
          Alert.alert('Cancelled', 'Your appointment has been cancelled. Refund will be processed soon.');
        }}
      ]
    );
  };

  const handleRateExperience = () => {
    setShowRating(true);
  };

  const submitRating = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }
    
    setShowRating(false);
    Alert.alert(t.thankYou, 'Your rating helps us improve our services.');
  };

  const renderRatingModal = () => {
    if (!showRating) return null;

    return (
      <View style={styles.ratingOverlay}>
        <View style={styles.ratingModal}>
          <Text style={styles.ratingTitle}>{t.rateExperience}</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Icon
                  name={star <= rating ? 'star' : 'star-border'}
                  size={40}
                  color={star <= rating ? '#FFD700' : '#E0E0E0'}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.ratingButtons}>
            <TouchableOpacity 
              style={styles.ratingCancelButton}
              onPress={() => setShowRating(false)}
            >
              <Text style={styles.ratingCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.ratingSubmitButton}
              onPress={submitRating}
            >
              <Text style={styles.ratingSubmitText}>{t.submitRating}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={60} color="#4CAF50" />
        </View>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
        
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>{t.bookingId}:</Text>
          <Text style={styles.bookingIdValue}>
            {bookingId}
          </Text>
        </View>
      </View>

      {/* Appointment Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>{t.appointmentDetails}</Text>
        
        <View style={styles.doctorSection}>
          <Image 
            source={{ uri: doctor?.avatar || 'https://via.placeholder.com/60' }} 
            style={styles.doctorAvatar} 
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor?.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor?.specialization}</Text>
            <View style={styles.doctorRating}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{doctor?.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.consultationType}:</Text>
          <Text style={styles.detailValue}>{getConsultationTypeText()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.appointmentTime}:</Text>
          <Text style={styles.detailValue}>{appointmentTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.consultationFee}:</Text>
          <Text style={styles.detailValue}>₹{paymentDetails?.amount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.paymentMethod}:</Text>
          <Text style={styles.detailValue}>{paymentDetails?.method?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Patient Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>{t.patientDetails}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.patientName}:</Text>
          <Text style={styles.detailValue}>
            {personalDetails?.name || `${personalDetails?.firstName} ${personalDetails?.lastName}`.trim()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.age}:</Text>
          <Text style={styles.detailValue}>{personalDetails?.age} years</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.gender}:</Text>
          <Text style={styles.detailValue}>{personalDetails?.gender}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.phone}:</Text>
          <Text style={styles.detailValue}>{personalDetails?.phone || personalDetails?.phoneNumber}</Text>
        </View>

        {symptoms?.description && (
          <View style={styles.symptomsSection}>
            <Text style={styles.detailLabel}>{t.symptoms}:</Text>
            <Text style={styles.symptomsText}>{symptoms.description}</Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.cardTitle}>{t.instructions}</Text>
        <Text style={styles.instructionText}>{t.instruction1}</Text>
        <Text style={styles.instructionText}>{t.instruction2}</Text>
        <Text style={styles.instructionText}>{t.instruction3}</Text>
        <Text style={styles.instructionText}>{t.instruction4}</Text>
        
        <View style={styles.reminderSection}>
          <Icon name="notifications" size={16} color="#FF9800" />
          <Text style={styles.reminderText}>{t.reminder}</Text>
        </View>
      </View>

      {/* Emergency Note */}
      <TouchableOpacity style={styles.emergencyCard} onPress={handleEmergencyCall}>
        <Icon name="emergency" size={24} color="#F44336" />
        <Text style={styles.emergencyText}>{t.emergency}</Text>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <Text style={styles.cardTitle}>{t.nextSteps}</Text>
        
        {/* Primary Action */}
        <TouchableOpacity style={styles.primaryAction} onPress={handleJoinConsultation}>
          <Icon 
            name={consultationType === 'video' ? 'videocam' : consultationType === 'voice' ? 'call' : 'chat'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.primaryActionText}>
            {consultationType === 'video' ? t.joinCall : 
             consultationType === 'voice' ? t.joinVoice : t.openChat}
          </Text>
        </TouchableOpacity>

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryAction} onPress={handleDownloadReceipt}>
            <Icon name="download" size={20} color="#00695C" />
            <Text style={styles.secondaryActionText}>{t.downloadReceipt}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleShareDetails}>
            <Icon name="share" size={20} color="#00695C" />
            <Text style={styles.secondaryActionText}>{t.shareDetails}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleAddToCalendar}>
            <Icon name="event" size={20} color="#00695C" />
            <Text style={styles.secondaryActionText}>{t.addToCalendar}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleReschedule}>
            <Icon name="schedule" size={20} color="#00695C" />
            <Text style={styles.secondaryActionText}>{t.reschedule}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Actions */}
      <View style={styles.additionalActions}>
        <TouchableOpacity style={styles.additionalAction} onPress={handleRateExperience}>
          <Icon name="star-rate" size={20} color="#FFD700" />
          <Text style={styles.additionalActionText}>{t.rateExperience}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalAction} onPress={() => onClose('book-another')}>
          <Icon name="add-circle-outline" size={20} color="#2196F3" />
          <Text style={styles.additionalActionText}>{t.bookAnother}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalAction} onPress={() => onClose('home')}>
          <Icon name="home" size={20} color="#4CAF50" />
          <Text style={styles.additionalActionText}>{t.goHome}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalAction} onPress={handleCancel}>
          <Icon name="cancel" size={20} color="#F44336" />
          <Text style={[styles.additionalActionText, { color: '#F44336' }]}>{t.cancel}</Text>
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      {renderRatingModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  successHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  successIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookingIdLabel: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  bookingIdValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#00695C',
    fontWeight: '600',
    marginBottom: 4,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  symptomsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  symptomsText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: '#FFF3E0',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  reminderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  reminderText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    marginBottom: 20,
  },
  emergencyText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 15,
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00695C',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  primaryActionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    width: (width - 50) / 2,
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 12,
    color: '#00695C',
    fontWeight: '600',
    marginLeft: 8,
  },
  additionalActions: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  additionalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  additionalActionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 15,
  },
  ratingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  ratingModal: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  ratingCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  ratingCancelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  ratingSubmitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#00695C',
  },
  ratingSubmitText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ConfirmationScreen;
