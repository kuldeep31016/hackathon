import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DocumentSummaryScreen from './DocumentSummaryScreen';

const { width, height } = Dimensions.get('window');

const DocumentUpload = ({ language, onNext, onBack }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const translations = {
    en: {
      title: 'Upload Medical Documents',
      subtitle: 'Upload any relevant medical documents, reports, or prescriptions',
      dragDrop: 'Tap to select files or drag & drop here',
      supportedFormats: 'Supported: JPG, PNG, PDF (Max 5MB each)',
      uploadFromCamera: 'Take Photo',
      uploadFromGallery: 'Choose from Gallery',
      uploadFromFiles: 'Select PDF Files',
      noFiles: 'No files uploaded yet',
      uploading: 'Uploading...',
      uploadSuccess: 'Upload successful!',
      uploadError: 'Upload failed. Please try again.',
      removeFile: 'Remove',
      retryUpload: 'Retry',
      continue: 'Continue',
      back: 'Back',
      skip: 'Skip',
      offline: 'Offline - Files will be uploaded when connected',
      cameraPermission: 'Camera permission required',
      storagePermission: 'Storage permission required',
      maxFileSize: 'File size too large (Max 5MB)',
      maxFiles: 'Maximum 5 files allowed',
      selectSource: 'Select Upload Source',
      instructions: 'Instructions & Guidelines',
      closeInstructions: 'Close',
      documentSummary: 'Document Summary',
      summaryPlaceholder: 'AI will analyze and summarize your document...',
      generateSummary: 'Generate Summary',
      summaryGenerated: 'Summary generated successfully!',
      // Instructions content
      instructionsTitle: 'Medical Document Upload Guidelines',
      instructionsSubtitle: 'Please follow these guidelines for best results',
      whatToUpload: 'What to Upload:',
      uploadList: [
        '• Prescriptions and medication lists',
        '• Lab reports and test results',
        '• Medical certificates',
        '• X-ray, MRI, or scan reports',
        '• Doctor consultation notes',
        '• Insurance documents',
        '• Vaccination records'
      ],
      dosTitle: 'Do\'s:',
      dosList: [
        '• Ensure good lighting when taking photos',
        '• Keep documents flat and unfolded',
        '• Capture the entire document',
        '• Use high resolution for better clarity',
        '• Include all relevant pages',
        '• Verify document is readable before uploading'
      ],
      dontsTitle: 'Don\'ts:',
      dontsList: [
        '• Don\'t upload blurry or unclear images',
        '• Don\'t upload personal photos unrelated to health',
        '• Don\'t upload documents with sensitive personal info',
        '• Don\'t upload duplicate documents',
        '• Don\'t upload corrupted or damaged files',
        '• Don\'t upload documents of others without permission'
      ],
      privacyNote: 'Privacy Note: All documents are encrypted and stored securely. Only authorized medical professionals can access your health records.',
    },
    hi: {
      title: 'मेडिकल दस्तावेज़ अपलोड करें',
      subtitle: 'कोई भी संबंधित मेडिकल दस्तावेज़, रिपोर्ट या नुस्खे अपलोड करें',
      dragDrop: 'फाइलें चुनने के लिए टैप करें या यहाँ ड्रैग करें',
      supportedFormats: 'समर्थित: JPG, PNG, PDF (अधिकतम 5MB प्रत्येक)',
      uploadFromCamera: 'फोटो लें',
      uploadFromGallery: 'गैलरी से चुनें',
      uploadFromFiles: 'PDF फाइलें चुनें',
      noFiles: 'अभी तक कोई फाइल अपलोड नहीं की गई',
      uploading: 'अपलोड हो रहा है...',
      uploadSuccess: 'अपलोड सफल!',
      uploadError: 'अपलोड असफल। कृपया पुनः प्रयास करें।',
      removeFile: 'हटाएं',
      retryUpload: 'पुनः प्रयास',
      continue: 'जारी रखें',
      back: 'वापस',
      skip: 'छोड़ें',
      offline: 'ऑफलाइन - कनेक्ट होने पर फाइलें अपलोड होंगी',
      cameraPermission: 'कैमरा अनुमति आवश्यक',
      storagePermission: 'स्टोरेज अनुमति आवश्यक',
      maxFileSize: 'फाइल साइज़ बहुत बड़ा (अधिकतम 5MB)',
      maxFiles: 'अधिकतम 5 फाइलों की अनुमति है',
      selectSource: 'अपलोड स्रोत चुनें',
      instructions: 'निर्देश और दिशानिर्देश',
      closeInstructions: 'बंद करें',
      documentSummary: 'दस्तावेज़ सारांश',
      summaryPlaceholder: 'AI आपके दस्तावेज़ का विश्लेषण और सारांश तैयार करेगा...',
      generateSummary: 'सारांश बनाएं',
      summaryGenerated: 'सारांश सफलतापूर्वक बनाया गया!',
      // Instructions content
      instructionsTitle: 'मेडिकल दस्तावेज़ अपलोड दिशानिर्देश',
      instructionsSubtitle: 'बेहतर परिणाम के लिए कृपया इन दिशानिर्देशों का पालन करें',
      whatToUpload: 'क्या अपलोड करें:',
      uploadList: [
        '• नुस्खे और दवाओं की सूची',
        '• लैब रिपोर्ट और टेस्ट परिणाम',
        '• मेडिकल प्रमाणपत्र',
        '• एक्स-रे, एमआरआई या स्कैन रिपोर्ट',
        '• डॉक्टर परामर्श नोट्स',
        '• बीमा दस्तावेज़',
        '• टीकाकरण रिकॉर्ड'
      ],
      dosTitle: 'क्या करें:',
      dosList: [
        '• फोटो लेते समय अच्छी रोशनी सुनिश्चित करें',
        '• दस्तावेज़ों को सपाट और खुला रखें',
        '• पूरा दस्तावेज़ कैप्चर करें',
        '• बेहतर स्पष्टता के लिए उच्च रिज़ॉल्यूशन का उपयोग करें',
        '• सभी प्रासंगिक पृष्ठ शामिल करें',
        '• अपलोड करने से पहले दस्तावेज़ पढ़ने योग्य है यह सत्यापित करें'
      ],
      dontsTitle: 'क्या न करें:',
      dontsList: [
        '• धुंधली या अस्पष्ट छवियां अपलोड न करें',
        '• स्वास्थ्य से असंबंधित व्यक्तिगत फोटो अपलोड न करें',
        '• संवेदनशील व्यक्तिगत जानकारी वाले दस्तावेज़ अपलोड न करें',
        '• डुप्लिकेट दस्तावेज़ अपलोड न करें',
        '• क्षतिग्रस्त या खराब फाइलें अपलोड न करें',
        '• बिना अनुमति के दूसरों के दस्तावेज़ अपलोड न करें'
      ],
      privacyNote: 'गोपनीयता नोट: सभी दस्तावेज़ एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत हैं। केवल अधिकृत चिकित्सा पेशेवर ही आपके स्वास्थ्य रिकॉर्ड तक पहुंच सकते हैं।',
    },
    pa: {
      title: 'ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ',
      subtitle: 'ਕੋਈ ਵੀ ਸੰਬੰਧਿਤ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼, ਰਿਪੋਰਟ ਜਾਂ ਨੁਸਖੇ ਅਪਲੋਡ ਕਰੋ',
      dragDrop: 'ਫਾਈਲਾਂ ਚੁਣਨ ਲਈ ਟੈਪ ਕਰੋ ਜਾਂ ਇੱਥੇ ਖਿੱਚੋ',
      supportedFormats: 'ਸਮਰਥਿਤ: JPG, PNG, PDF (ਵੱਧ ਤੋਂ ਵੱਧ 5MB ਹਰੇਕ)',
      uploadFromCamera: 'ਫੋਟੋ ਲਓ',
      uploadFromGallery: 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ',
      uploadFromFiles: 'PDF ਫਾਈਲਾਂ ਚੁਣੋ',
      noFiles: 'ਅਜੇ ਤੱਕ ਕੋਈ ਫਾਈਲ ਅਪਲੋਡ ਨਹੀਂ ਕੀਤੀ ਗਈ',
      uploading: 'ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      uploadSuccess: 'ਅਪਲੋਡ ਸਫਲ!',
      uploadError: 'ਅਪਲੋਡ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      removeFile: 'ਹਟਾਓ',
      retryUpload: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਵਾਪਸ',
      skip: 'ਛੱਡੋ',
      offline: 'ਔਫਲਾਈਨ - ਕਨੈਕਟ ਹੋਣ ਤੇ ਫਾਈਲਾਂ ਅਪਲੋਡ ਹੋਣਗੀਆਂ',
      cameraPermission: 'ਕੈਮਰਾ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ',
      storagePermission: 'ਸਟੋਰੇਜ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ',
      maxFileSize: 'ਫਾਈਲ ਸਾਈਜ਼ ਬਹੁਤ ਵੱਡਾ (ਵੱਧ ਤੋਂ ਵੱਧ 5MB)',
      maxFiles: 'ਵੱਧ ਤੋਂ ਵੱਧ 5 ਫਾਈਲਾਂ ਦੀ ਇਜਾਜ਼ਤ ਹੈ',
    },
  };

  const t = translations[language];

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const simulateFileUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'success',
          url: file.uri || 'https://example.com/file',
        });
      }, 2000);
    });
  };

  const handleFileUpload = async (source) => {
    if (uploadedFiles.length >= 5) {
      Alert.alert('Error', t.maxFiles);
      return;
    }

    setIsUploading(true);

    try {
      let result = null;

      switch (source) {
        case 'camera':
          // Request camera permissions
          const cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPermissions.granted) {
            Alert.alert('Permission Required', t.cameraPermission);
            setIsUploading(false);
            return;
          }

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: false,
          });
          break;

        case 'gallery':
          // Request media library permissions
          const libraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!libraryPermissions.granted) {
            Alert.alert('Permission Required', t.storagePermission);
            setIsUploading(false);
            return;
          }

          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: false,
          });
          break;

        case 'files':
          result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*'],
            copyToCacheDirectory: true,
            multiple: false,
          });
          break;
      }

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Check file size (5MB limit)
        if (asset.fileSize && asset.fileSize > 5000000) {
          Alert.alert('Error', t.maxFileSize);
          setIsUploading(false);
          return;
        }

        // Create file object
        const newFile = {
          id: Date.now() + Math.random(),
          name: asset.fileName || `${source}_${Date.now()}.${asset.type?.includes('pdf') ? 'pdf' : 'jpg'}`,
          type: asset.mimeType || (asset.type?.includes('pdf') ? 'application/pdf' : 'image/jpeg'),
          size: asset.fileSize || Math.random() * 3000000 + 500000,
          uri: asset.uri,
          status: 'uploading',
          progress: 0,
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate upload progress
        const updateProgress = (fileId, progress) => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId ? { ...file, progress } : file
            )
          );
        };

        // Simulate progress updates
        for (let progress = 10; progress <= 100; progress += 10) {
          setTimeout(() => {
            updateProgress(newFile.id, progress);
          }, (progress / 10) * 200);
        }

        // Simulate upload completion
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === newFile.id ? { ...file, status: 'success' } : file
            )
          );
          Alert.alert('Success', t.uploadSuccess);
        }, 2000);

      } else if (result && result.canceled) {
        // User cancelled the picker
        console.log('User cancelled file selection');
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', t.uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const retryUpload = async (file) => {
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );

    try {
      const uploadedFile = await simulateFileUpload(file);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...uploadedFile } : f
        )
      );
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type === 'application/pdf') {
      return 'picture-as-pdf';
    }
    return 'insert-drive-file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateDocumentSummary = async (file) => {
    // Simulate AI document analysis and summarization
    const summary = `Document Analysis Summary:
    
Type: ${file.type === 'image' ? 'Medical Image/Report' : 'PDF Document'}
Key Information Detected:
• Medical report/prescription identified
• Contains patient information and medical data
• Recommended for doctor review
• File quality: ${file.size > 1000000 ? 'Good' : 'Acceptable'}

This document appears to be a medical record that should be reviewed by a healthcare professional. Please ensure all information is clearly visible and complete.`;

    return summary;
  };

  const handleSourceSelection = (source) => {
    setShowSourceModal(false);
    handleFileUpload(source);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      {/* Upload Area */}
      <View style={styles.uploadArea}>
        <Icon name="cloud-upload" size={50} color="#00695C" />
        <Text style={styles.uploadText}>{t.dragDrop}</Text>
        <Text style={styles.supportedText}>{t.supportedFormats}</Text>
        
        <TouchableOpacity
          style={[
            styles.mainUploadButton,
            isUploading && styles.uploadButtonDisabled
          ]}
          onPress={() => {
            console.log('Upload button pressed');
            if (!isUploading) {
              setShowSourceModal(true);
            }
          }}
          disabled={isUploading}
          activeOpacity={isUploading ? 1 : 0.7}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.mainUploadButtonText}>Upload Medical Documents</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.instructionsButton}
          onPress={() => setShowInstructions(true)}
          activeOpacity={0.7}
        >
          <Icon name="info-outline" size={20} color="#00695C" />
          <Text style={styles.instructionsButtonText}>{t.instructions}</Text>
        </TouchableOpacity>
      </View>

      {/* Offline Indicator */}
      <View style={styles.offlineIndicator}>
        <Icon name="wifi-off" size={16} color="#FF9800" />
        <Text style={styles.offlineText}>{t.offline}</Text>
      </View>

      {/* Uploaded Files */}
      <View style={styles.filesSection}>
        {uploadedFiles.length === 0 ? (
          <View style={styles.noFiles}>
            <Icon name="description" size={40} color="#ccc" />
            <Text style={styles.noFilesText}>{t.noFiles}</Text>
          </View>
        ) : (
          uploadedFiles.map((file) => (
            <View key={file.id} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Icon 
                  name={getFileIcon(file.type)} 
                  size={40} 
                  color="#00695C" 
                />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                  
                  {file.status === 'uploading' && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${file.progress || 0}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{file.progress || 0}%</Text>
                    </View>
                  )}
                  
                  {file.status === 'success' && (
                    <View style={styles.statusContainer}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.successText}>{t.uploadSuccess}</Text>
                      {file.summary && (
                        <View style={styles.summaryContainer}>
                          <Text style={styles.summaryLabel}>{t.documentSummary}:</Text>
                          <Text style={styles.summaryText}>{file.summary}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  {file.status === 'error' && (
                    <View style={styles.statusContainer}>
                      <Icon name="error" size={16} color="#F44336" />
                      <Text style={styles.errorText}>{t.uploadError}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.fileActions}>
                {file.status === 'success' && !file.summary && (
                  <TouchableOpacity
                    style={styles.summaryButton}
                    onPress={async () => {
                      console.log('Generate summary for file:', file.name);
                      const summary = await generateDocumentSummary(file);
                      setUploadedFiles(prev => prev.map(f => 
                        f.id === file.id ? { ...f, summary } : f
                      ));
                    }}
                    activeOpacity={0.7}
                  >
                    <Icon name="auto-awesome" size={20} color="#2196F3" />
                  </TouchableOpacity>
                )}
                
                {file.status === 'error' && (
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      console.log('Retry button pressed for file:', file.name);
                      retryUpload(file);
                    }}
                    activeOpacity={0.7}
                  >
                    <Icon name="refresh" size={20} color="#FF9800" />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    file.status === 'uploading' && styles.removeButtonDisabled
                  ]}
                  onPress={() => {
                    console.log('Remove button pressed for file:', file.name);
                    if (file.status !== 'uploading') {
                      removeFile(file.id);
                    }
                  }}
                  disabled={file.status === 'uploading'}
                  activeOpacity={file.status === 'uploading' ? 1 : 0.7}
                >
                  <Icon 
                    name="close" 
                    size={20} 
                    color={file.status === 'uploading' ? '#ccc' : '#F44336'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Source Selection Modal */}
      <Modal
        visible={showSourceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectSource}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSourceModal(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.sourceOptions}>
              <TouchableOpacity
                style={[styles.sourceOption, styles.cameraOption]}
                onPress={() => handleSourceSelection('camera')}
                activeOpacity={0.7}
              >
                <Icon name="camera-alt" size={40} color="#fff" />
                <Text style={styles.sourceOptionText}>{t.uploadFromCamera}</Text>
                <Text style={styles.sourceOptionSubtext}>Take a photo of your document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sourceOption, styles.galleryOption]}
                onPress={() => handleSourceSelection('gallery')}
                activeOpacity={0.7}
              >
                <Icon name="photo-library" size={40} color="#fff" />
                <Text style={styles.sourceOptionText}>{t.uploadFromGallery}</Text>
                <Text style={styles.sourceOptionSubtext}>Choose from your photos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sourceOption, styles.filesOption]}
                onPress={() => handleSourceSelection('files')}
                activeOpacity={0.7}
              >
                <Icon name="folder-open" size={40} color="#fff" />
                <Text style={styles.sourceOptionText}>{t.uploadFromFiles}</Text>
                <Text style={styles.sourceOptionSubtext}>Select PDF files</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInstructions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.instructionsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.instructionsTitle}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowInstructions(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.instructionsContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.instructionsSubtitle}>{t.instructionsSubtitle}</Text>
              
              <View style={styles.instructionSection}>
                <Text style={styles.instructionSectionTitle}>{t.whatToUpload}</Text>
                {t.uploadList.map((item, index) => (
                  <Text key={index} style={styles.instructionItem}>{item}</Text>
                ))}
              </View>

              <View style={styles.instructionSection}>
                <Text style={styles.instructionSectionTitle}>{t.dosTitle}</Text>
                {t.dosList.map((item, index) => (
                  <Text key={index} style={styles.instructionItem}>{item}</Text>
                ))}
              </View>

              <View style={styles.instructionSection}>
                <Text style={styles.instructionSectionTitle}>{t.dontsTitle}</Text>
                {t.dontsList.map((item, index) => (
                  <Text key={index} style={styles.instructionItem}>{item}</Text>
                ))}
              </View>

              <View style={styles.privacySection}>
                <Icon name="security" size={20} color="#4CAF50" />
                <Text style={styles.privacyText}>{t.privacyNote}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Document Summary Screen */}
      <DocumentSummaryScreen
        visible={showSummary}
        onClose={() => {
          setShowSummary(false);
          // Call onNext with uploaded files when summary is closed
          if (onNext && typeof onNext === 'function') {
            onNext(uploadedFiles);
          }
        }}
        documents={uploadedFiles}
        language={language}
      />

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Back button pressed in DocumentUpload');
            if (onBack && typeof onBack === 'function') {
              onBack();
            } else {
              console.log('onBack function not available');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => {
            console.log('Skip button pressed in DocumentUpload');
            if (onNext && typeof onNext === 'function') {
              onNext([]);
            } else {
              console.log('onNext function not available');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>{t.skip}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            uploadedFiles.length === 0 && styles.continueButtonDisabled
          ]} 
          onPress={() => {
            console.log('Continue button pressed in DocumentUpload with files:', uploadedFiles.length);
            if (uploadedFiles.length > 0) {
              setShowSummary(true);
            }
          }}
          disabled={uploadedFiles.length === 0}
          activeOpacity={uploadedFiles.length === 0 ? 1 : 0.7}
        >
          <Text style={[
            styles.continueButtonText,
            uploadedFiles.length === 0 && { color: '#999' }
          ]}>
            {uploadedFiles.length > 0 ? 'View AI Analysis' : t.continue}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadArea: {
    margin: 20,
    padding: 30,
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00695C',
    borderStyle: 'dashed',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00695C',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  mainUploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 105, 92, 0.1)',
  },
  instructionsButtonText: {
    color: '#00695C',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  uploadText: {
    fontSize: 18,
    color: '#00695C',
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  supportedText: {
    fontSize: 14,
    color: '#00695C',
    marginTop: 5,
    textAlign: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: width * 0.25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  cameraButton: {
    backgroundColor: '#FF5722',
  },
  galleryButton: {
    backgroundColor: '#2196F3',
  },
  filesButton: {
    backgroundColor: '#FF9800',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  offlineText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: width * 0.9,
    maxHeight: height * 0.6,
  },
  instructionsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: width * 0.95,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  sourceOptions: {
    gap: 15,
  },
  sourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cameraOption: {
    backgroundColor: '#FF5722',
  },
  galleryOption: {
    backgroundColor: '#2196F3',
  },
  filesOption: {
    backgroundColor: '#FF9800',
  },
  sourceOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    flex: 1,
  },
  sourceOptionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 15,
  },
  // Instructions modal styles
  instructionsContent: {
    flex: 1,
  },
  instructionsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  instructionSection: {
    marginBottom: 20,
  },
  instructionSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00695C',
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
  privacySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  privacyText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  // Summary styles
  summaryContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
  },
  summaryButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    marginRight: 8,
  },
  filesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noFiles: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noFilesText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
    marginLeft: 15,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 35,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 5,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButton: {
    padding: 8,
    marginRight: 10,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonDisabled: {
    opacity: 0.5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00695C',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#00695C',
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#00695C',
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default DocumentUpload;
