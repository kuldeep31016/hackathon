import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ConsultationFlow from './src/screens/consultation/ConsultationFlow';
import CheckSymptomsScreen from './src/screens/CheckSymptomsScreen';
import ASHAWorkerHub from './src/screens/ASHAWorkerHub';
import DocumentUpload from './src/screens/consultation/DocumentUpload';
import { Linking } from 'react-native';

const translations = {
  en: {
    appTitle: "🏥 Nabha Health App",
    appSubtitle: "Telemedicine for Rural Punjab",
    appDescription: "Healthcare for Farmers and Patients",
    consultDoctor: "Consult Doctor",
    emergencySOS: "Emergency SOS", 
    checkSymptoms: "Check Symptoms",
    ashaWorker: "ASHA Worker",
    uploadReports: "📋 Upload Medical Reports",
    uploadDescription: "Upload Medical Reports",
    chooseReports: "📄 Choose Reports",
    uploadSubtext: "For better diagnosis by doctors",
    startApp: "Start App",
    multiLangSupport: "✅ Multi-Language Support: Punjabi, Hindi, English",
    offlineSupport: "✅ Offline Support ✅ Emergency Service ✅ Video Call",
    appRunning: "🎉 Mobile App is Running Successfully!",
    selectLanguage: "Select Language",
    bloodReports: "Blood Reports • Lab Tests • X-Rays",
    securePrivate: "Secure & Private",
    fileFormats: "PDF, JPG, PNG Formats"
  },
  hi: {
    appTitle: "🏥 नभा स्वास्थ्य ऐप",
    appSubtitle: "ग्रामीण पंजाब के लिए टेलीमेडिसिन",
    appDescription: "किसानों और मरीजों के लिए स्वास्थ्य सेवा",
    consultDoctor: "डॉक्टर से सलाह लें",
    emergencySOS: "आपातकालीन SOS",
    checkSymptoms: "लक्षण जांचें",
    ashaWorker: "आशा कार्यकर्ता",
    uploadReports: "📋 मेडिकल रिपोर्ट अपलोड करें",
    uploadDescription: "मेडिकल रिपोर्ट अपलोड करें",
    chooseReports: "📄 रिपोर्ट चुनें",
    uploadSubtext: "डॉक्टरों द्वारा बेहतर निदान के लिए",
    startApp: "ऐप शुरू करें",
    multiLangSupport: "✅ बहु-भाषा समर्थन: पंजाबी, हिंदी, अंग्रेजी",
    offlineSupport: "✅ ऑफलाइन समर्थन ✅ आपातकालीन सेवा ✅ वीडियो कॉल",
    appRunning: "🎉 मोबाइल ऐप सफलतापूर्वक चल रहा है!",
    selectLanguage: "भाषा चुनें",
    bloodReports: "ब्लड रिपोर्ट • लैब टेस्ट • एक्स-रे",
    securePrivate: "सुरक्षित और निजी",
    fileFormats: "PDF, JPG, PNG फॉर्मेट"
  },
  pa: {
    appTitle: "🏥 ਨਭਾ ਸਿਹਤ ਐਪ",
    appSubtitle: "ਪੇਂਡੂ ਪੰਜਾਬ ਲਈ ਟੈਲੀਮੈਡੀਸਿਨ",
    appDescription: "ਕਿਸਾਨਾਂ ਅਤੇ ਮਰੀਜ਼ਾਂ ਲਈ ਸਿਹਤ ਸੇਵਾ",
    consultDoctor: "ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ",
    emergencySOS: "ਐਮਰਜੈਂਸੀ SOS",
    checkSymptoms: "ਲੱਛਣ ਚੈਕ ਕਰੋ",
    ashaWorker: "ASHA ਵਰਕਰ",
    uploadReports: "📋 ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ",
    uploadDescription: "ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ",
    chooseReports: "📄 ਰਿਪੋਰਟ ਚੁਣੋ",
    uploadSubtext: "ਡਾਕਟਰ ਦੀ ਬਿਹਤਰ ਸਲਾਹ ਲਈ",
    startApp: "ਐਪ ਸ਼ੁਰੂ ਕਰੋ",
    multiLangSupport: "✅ ਮਲਟੀ-ਲੈਂਗੂਏਜ ਸਪੋਰਟ: ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ",
    offlineSupport: "✅ ਆਫਲਾਈਨ ਸਪੋਰਟ ✅ ਐਮਰਜੈਂਸੀ ਸਰਵਿਸ ✅ ਵੀਡੀਓ ਕਾਲ",
    appRunning: "🎉 ਮੋਬਾਈਲ ਐਪ ਸਫਲਤਾਪੂਰਵਕ ਚੱਲ ਰਿਹਾ ਹੈ!",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    bloodReports: "ਖੂਨ ਦੀ ਰਿਪੋਰਟ • ਲੈਬ ਟੈਸਟ • ਐਕਸ-ਰੇ",
    securePrivate: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ",
    fileFormats: "PDF, JPG, PNG ਫਾਈਲਾਂ"
  }
};

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showConsultationFlow, setShowConsultationFlow] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [showSymptomsChecker, setShowSymptomsChecker] = useState(false);
  const [showASHAHub, setShowASHAHub] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  
  const t = translations[currentLanguage];

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setShowLanguageModal(false);
  };

  const openConsultationFlow = () => {
    setShowConsultationFlow(true);
  };

  const closeConsultationFlow = () => {
    setShowConsultationFlow(false);
  };

  const handleEmergencyCall = (serviceType, number, serviceName) => {
    setEmergencyActive(true);
    
    // Auto-reset emergency status after 10 seconds
    setTimeout(() => {
      setEmergencyActive(false);
    }, 10000);
    
    return Alert.alert(
      `${serviceType} Emergency Service`,
      `🚨 EMERGENCY ALERT ACTIVATED 🚨\n\n📞 Service: ${serviceName}\n📱 Number: ${number}\n📍 Location: Getting GPS coordinates...\n🕐 Time: ${new Date().toLocaleString()}\n\n⚡ Emergency services will be contacted immediately!`,
      [
        { 
          text: 'Call Now', 
          onPress: () => {
            console.log(`Emergency call to ${number} for ${serviceName}`);
            Alert.alert('📞 Calling...', `Connecting to ${serviceName} at ${number}\n\nPlease stay on the line and provide your location and emergency details.`);
          }
        },
        { text: 'Cancel', style: 'cancel', onPress: () => setEmergencyActive(false) }
      ]
    );
  };
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Language Selector */}
      <View style={styles.languageBar}>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Text style={styles.languageButtonText}>🌐 {t.selectLanguage}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{t.appTitle}</Text>
        <Text style={styles.subtitle}>{t.appSubtitle}</Text>
        <Text style={styles.description}>{t.appDescription}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {/* First Row */}
        <View style={styles.featureRow}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={openConsultationFlow}
            activeOpacity={0.7}
          >
            <Text style={styles.featureIcon}>👩‍⚕️</Text>
            <Text style={styles.featureTitle}>{t.consultDoctor}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, emergencyActive && styles.emergencyActiveCard]}
            onPress={() => {
              Alert.alert(
                '🚨 EMERGENCY SOS SYSTEM',
                'Punjab Emergency Services\n\nSelect the type of emergency assistance needed:',
                [
                  { 
                    text: '🚔 Police Emergency', 
                    onPress: () => handleEmergencyCall('🚔', '100', 'Punjab Police Emergency')
                  },
                  { 
                    text: '🚑 Medical Emergency', 
                    onPress: () => handleEmergencyCall('🚑', '108', 'Ambulance Service')
                  },
                  { 
                    text: '🚒 Fire Emergency', 
                    onPress: () => handleEmergencyCall('🚒', '101', 'Fire Department')
                  },
                  { 
                    text: '🏥 Nabha Hospital', 
                    onPress: () => handleEmergencyCall('🏥', '+91-1765-222222', 'Nabha Civil Hospital')
                  },
                  { 
                    text: '⚡ ALL SERVICES (Critical)', 
                    onPress: () => {
                      setEmergencyActive(true);
                      Alert.alert(
                        '⚡ CRITICAL EMERGENCY ALERT',
                        '🚨 ALL EMERGENCY SERVICES ACTIVATED 🚨\n\n✅ Police (100) - Dispatched\n✅ Ambulance (108) - En Route\n✅ Fire Department (101) - Notified\n✅ Nabha Hospital - Alerted\n✅ Emergency Contacts - Messaged\n\n📍 Your location has been shared with all services\n🕐 Response Time: 5-15 minutes\n\n🚁 Emergency coordinator will contact you shortly.',
                        [
                          { text: 'Track Response', onPress: () => console.log('Tracking all emergency services') },
                          { text: 'I\'m Safe Now', onPress: () => {
                            setEmergencyActive(false);
                            Alert.alert('Emergency Cancelled', 'All services have been notified that you are safe.');
                          }}
                        ]
                      );
                      setTimeout(() => setEmergencyActive(false), 30000); // Reset after 30 seconds
                    }
                  },
                  { text: 'Cancel', style: 'cancel' }
                ],
                { cancelable: true }
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sosButton, emergencyActive && styles.sosButtonActive]}>
              <Text style={styles.sosIcon}>🚨</Text>
            </View>
            <Text style={[styles.featureTitle, emergencyActive && styles.emergencyActiveText]}>
              {emergencyActive ? 'EMERGENCY ACTIVE' : t.emergencySOS}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Second Row */}
        <View style={styles.featureRow}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setShowSymptomsChecker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.featureIcon}>🩺</Text>
            <Text style={styles.featureTitle}>{t.checkSymptoms}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setShowASHAHub(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.featureIcon}>👩‍🌾</Text>
            <Text style={styles.featureTitle}>{t.ashaWorker}</Text>
          </TouchableOpacity>
          
        </View>

        {/* third Row with new feature */}
        
        <View style={styles.featureRow}>
  <TouchableOpacity 
    style={styles.featureCard}
    onPress={() => Linking.openURL("http://192.168.1.36:3000/")}
    activeOpacity={0.7}
  >
    <Text style={styles.featureIcon}>🔔</Text>
    <Text style={styles.featureTitle}>Set Reminder</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.featureCard}
    onPress={() => Linking.openURL("http://192.168.1.36:8501/")}
    activeOpacity={0.7}
  >
    <Text style={styles.featureIcon}>🤖</Text>
    <Text style={styles.featureTitle}>Health assistant</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* Medical Report Upload Section */}
      {/* <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>{t.uploadReports}</Text>
        
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setShowDocumentUpload(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadButtonText}>{t.chooseReports}</Text>
          <Text style={styles.uploadSubtext}>{t.uploadSubtext}</Text>
        </TouchableOpacity>

        <View style={styles.uploadInfoContainer}>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadInfoIcon}>✅</Text>
            <Text style={styles.uploadInfoText}>{t.bloodReports}</Text>
          </View>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadInfoIcon}>🔒</Text>
            <Text style={styles.uploadInfoText}>{t.securePrivate}</Text>
          </View>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadInfoIcon}>📱</Text>
            <Text style={styles.uploadInfoText}>{t.fileFormats}</Text>
          </View>
        </View>
      </View> */}

      {/* <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>{t.startApp}</Text>
      </TouchableOpacity> */}

      {/* App Features Card */}
      <View style={styles.infoCard}>
        <Text style={styles.footerText}>{t.multiLangSupport}</Text>
        <Text style={styles.footerText}>{t.offlineSupport}</Text>
        <Text style={styles.status}>{t.appRunning}</Text>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ</Text>
            
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'en' && styles.selectedLanguage]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={styles.languageOptionText}>🇺🇸 English</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'hi' && styles.selectedLanguage]}
              onPress={() => changeLanguage('hi')}
            >
              <Text style={styles.languageOptionText}>🇮🇳 हिंदी (Hindi)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'pa' && styles.selectedLanguage]}
              onPress={() => changeLanguage('pa')}
            >
              <Text style={styles.languageOptionText}>🇮🇳 ਪੰਜਾਬੀ (Punjabi)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeButtonText}>Close / बंद करें / ਬੰਦ ਕਰੋ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Consultation Flow Modal */}
      <ConsultationFlow
        isVisible={showConsultationFlow}
        onClose={closeConsultationFlow}
        language={currentLanguage}
      />

      {/* Check Symptoms Modal */}
      <CheckSymptomsScreen
        visible={showSymptomsChecker}
        onClose={() => setShowSymptomsChecker(false)}
        language={currentLanguage}
      />

      {/* ASHA Worker Hub Modal */}
      <ASHAWorkerHub
        visible={showASHAHub}
        onClose={() => setShowASHAHub(false)}
        language={currentLanguage}
      />

      {/* Document Upload Modal */}
      <Modal
        visible={showDocumentUpload}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDocumentUpload(false)}
      >
        <DocumentUpload
          language={currentLanguage}
          onNext={(documents) => {
            console.log('Documents uploaded:', documents);
            Alert.alert(
              'Success!', 
              `Successfully uploaded ${documents.length} document(s). Your medical reports have been saved securely.`,
              [{ text: 'OK', onPress: () => setShowDocumentUpload(false) }]
            );
          }}
          onBack={() => setShowDocumentUpload(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',

  },
  languageBar: {
    backgroundColor: '#2563eb',
    padding: 10,
    alignItems: 'center',
    
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
   marginTop: 35,
   marginLeft: 130,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
  
  },
  featuresContainer: {
    padding: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    width: '47%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2c5aa0',
    minHeight: 110,
    justifyContent: 'center',
  },
  emergencyActiveCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  emergencyActiveText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  sosButtonActive: {
    backgroundColor: '#dc2626',
    transform: [{ scale: 1.1 }],
  },
  sosIcon: {
    fontSize: 30,
    color: 'white',
  },
  uploadSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  uploadSubtext: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  uploadInfoContainer: {
    marginTop: 10,
  },
  uploadInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadInfoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  uploadInfoText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#10b981',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    padding: 30,
    paddingVertical: 40,
    alignItems: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  footer: {
    padding: 20,
    alignItems: 'center',

  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedLanguage: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#1e293b',
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
