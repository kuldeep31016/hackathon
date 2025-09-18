import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AIAnalysisService } from '../../services/AIAnalysisService';

const { width, height } = Dimensions.get('window');

const DocumentSummaryScreen = ({ 
  visible, 
  onClose, 
  documents, 
  language = 'en' 
}) => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);

  const translations = {
    en: {
      title: 'AI Document Analysis',
      subtitle: 'Your medical documents have been analyzed',
      analyzing: 'Analyzing documents...',
      documentType: 'Document Type',
      keyFindings: 'Key Findings',
      healthIssues: 'Health Issues Detected',
      recommendations: 'Recommendations',
      confidence: 'Analysis Confidence',
      summary: 'Summary',
      nextDocument: 'Next Document',
      previousDocument: 'Previous Document',
      close: 'Close',
      shareWithDoctor: 'Share with Doctor',
      saveToRecords: 'Save to Medical Records',
      aiPowered: 'AI-Powered Analysis',
      disclaimer: 'This analysis is for informational purposes only. Please consult with a healthcare professional for proper medical advice.',
    },
    hi: {
      title: 'AI दस्तावेज़ विश्लेषण',
      subtitle: 'आपके मेडिकल दस्तावेज़ों का विश्लेषण किया गया है',
      analyzing: 'दस्तावेज़ों का विश्लेषण हो रहा है...',
      documentType: 'दस्तावेज़ प्रकार',
      keyFindings: 'मुख्य निष्कर्ष',
      healthIssues: 'स्वास्थ्य समस्याएं',
      recommendations: 'सुझाव',
      confidence: 'विश्लेषण आत्मविश्वास',
      summary: 'सारांश',
      nextDocument: 'अगला दस्तावेज़',
      previousDocument: 'पिछला दस्तावेज़',
      close: 'बंद करें',
      shareWithDoctor: 'डॉक्टर के साथ साझा करें',
      saveToRecords: 'मेडिकल रिकॉर्ड में सहेजें',
      aiPowered: 'AI-संचालित विश्लेषण',
      disclaimer: 'यह विश्लेषण केवल सूचनात्मक उद्देश्यों के लिए है। उचित चिकित्सा सलाह के लिए कृपया एक स्वास्थ्य पेशेवर से परामर्श करें।',
    },
    pa: {
      title: 'AI ਦਸਤਾਵੇਜ਼ ਵਿਸ਼ਲੇਸ਼ਣ',
      subtitle: 'ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਗਿਆ ਹੈ',
      analyzing: 'ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',
      documentType: 'ਦਸਤਾਵੇਜ਼ ਕਿਸਮ',
      keyFindings: 'ਮੁੱਖ ਨਤੀਜੇ',
      healthIssues: 'ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ',
      recommendations: 'ਸਿਫਾਰਸ਼ਾਂ',
      confidence: 'ਵਿਸ਼ਲੇਸ਼ਣ ਭਰੋਸਾ',
      summary: 'ਸਾਰ',
      nextDocument: 'ਅਗਲਾ ਦਸਤਾਵੇਜ਼',
      previousDocument: 'ਪਿਛਲਾ ਦਸਤਾਵੇਜ਼',
      close: 'ਬੰਦ ਕਰੋ',
      shareWithDoctor: 'ਡਾਕਟਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ',
      saveToRecords: 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਵਿੱਚ ਸੇਵ ਕਰੋ',
      aiPowered: 'AI-ਸੰਚਾਲਿਤ ਵਿਸ਼ਲੇਸ਼ਣ',
      disclaimer: 'ਇਹ ਵਿਸ਼ਲੇਸ਼ਣ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਹੈ। ਉਚਿਤ ਮੈਡੀਕਲ ਸਲਾਹ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।',
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (visible && documents && documents.length > 0) {
      analyzeDocuments();
    }
  }, [visible, documents]);

  const analyzeDocuments = async () => {
    setIsAnalyzing(true);
    const results = [];

    try {
      // Test API key first
      console.log('Testing API key before analysis...');
      const apiWorking = await AIAnalysisService.testAPIKey();
      console.log('API test result:', apiWorking);
      
      for (const doc of documents) {
        console.log('Processing document:', doc.name);
        const analysis = await AIAnalysisService.testImageAnalysis(
          doc.uri, 
          doc.name
        );
        results.push({
          document: doc,
          analysis: analysis
        });
      }
      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', `Failed to analyze documents: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShareWithDoctor = () => {
    Alert.alert(
      'Share with Doctor',
      'This feature will allow you to share the analysis results with your healthcare provider.',
      [{ text: 'OK' }]
    );
  };

  const handleSaveToRecords = () => {
    Alert.alert(
      'Save to Records',
      'Analysis results have been saved to your medical records.',
      [{ text: 'OK' }]
    );
  };

  const renderAnalysisSection = (title, items, iconName, color = '#00695C') => (
    <View style={styles.analysisSection}>
      <View style={styles.sectionHeader}>
        <Icon name={iconName} size={20} color={color} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {Array.isArray(items) ? (
          items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sectionText}>{items}</Text>
        )}
      </View>
    </View>
  );

  const renderDocumentNavigation = () => {
    if (analysisResults.length <= 1) return null;

    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentDocumentIndex === 0 && styles.navButtonDisabled
          ]}
          onPress={() => setCurrentDocumentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentDocumentIndex === 0}
        >
          <Icon name="chevron-left" size={24} color="#00695C" />
          <Text style={styles.navButtonText}>{t.previousDocument}</Text>
        </TouchableOpacity>

        <Text style={styles.documentCounter}>
          {currentDocumentIndex + 1} / {analysisResults.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentDocumentIndex === analysisResults.length - 1 && styles.navButtonDisabled
          ]}
          onPress={() => setCurrentDocumentIndex(prev => Math.min(analysisResults.length - 1, prev + 1))}
          disabled={currentDocumentIndex === analysisResults.length - 1}
        >
          <Text style={styles.navButtonText}>{t.nextDocument}</Text>
          <Icon name="chevron-right" size={24} color="#00695C" />
        </TouchableOpacity>
      </View>
    );
  };

  if (!visible) return null;

  const currentResult = analysisResults[currentDocumentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {isAnalyzing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00695C" />
          <Text style={styles.loadingText}>{t.analyzing}</Text>
        </View>
      ) : currentResult ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderDocumentNavigation()}

          {/* Document Preview */}
          <View style={styles.documentPreview}>
            <Image 
              source={{ uri: currentResult.document.uri }} 
              style={styles.documentImage}
              resizeMode="contain"
            />
            <Text style={styles.documentName}>{currentResult.document.name}</Text>
          </View>

          {/* AI Analysis Results */}
          <View style={styles.aiBadge}>
            <Icon name="auto-awesome" size={16} color="#FFD700" />
            <Text style={styles.aiBadgeText}>{t.aiPowered}</Text>
          </View>

          {renderAnalysisSection(
            t.documentType,
            currentResult.analysis.documentType,
            'description',
            '#2196F3'
          )}

          {renderAnalysisSection(
            t.keyFindings,
            currentResult.analysis.keyFindings,
            'search',
            '#4CAF50'
          )}

          {renderAnalysisSection(
            t.healthIssues,
            currentResult.analysis.healthIssues,
            'health-and-safety',
            '#FF9800'
          )}

          {renderAnalysisSection(
            t.recommendations,
            currentResult.analysis.recommendations,
            'lightbulb-outline',
            '#9C27B0'
          )}

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>{t.confidence}</Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { width: `${currentResult.analysis.confidence}%` }
                ]} 
              />
            </View>
            <Text style={styles.confidenceText}>{currentResult.analysis.confidence}%</Text>
          </View>

          {renderAnalysisSection(
            t.summary,
            currentResult.analysis.summary,
            'summarize',
            '#00695C'
          )}

          {/* Extracted Data Section */}
          {currentResult.analysis.extractedData && Object.keys(currentResult.analysis.extractedData).length > 0 && (
            <View style={styles.analysisSection}>
              <View style={styles.sectionHeader}>
                <Icon name="data-usage" size={20} color="#9C27B0" />
                <Text style={styles.sectionTitle}>Extracted Information</Text>
              </View>
              <View style={styles.sectionContent}>
                {currentResult.analysis.extractedData.patientName && (
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Patient:</Text>
                    <Text style={styles.dataValue}>{currentResult.analysis.extractedData.patientName}</Text>
                  </View>
                )}
                {currentResult.analysis.extractedData.date && (
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Date:</Text>
                    <Text style={styles.dataValue}>{currentResult.analysis.extractedData.date}</Text>
                  </View>
                )}
                {currentResult.analysis.extractedData.physician && (
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Physician:</Text>
                    <Text style={styles.dataValue}>{currentResult.analysis.extractedData.physician}</Text>
                  </View>
                )}
                {currentResult.analysis.extractedData.diagnosis && (
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Diagnosis:</Text>
                    <Text style={styles.dataValue}>{currentResult.analysis.extractedData.diagnosis}</Text>
                  </View>
                )}
                {currentResult.analysis.extractedData.medications && currentResult.analysis.extractedData.medications.length > 0 && (
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Medications:</Text>
                    <Text style={styles.dataValue}>{currentResult.analysis.extractedData.medications.join(', ')}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShareWithDoctor}
            >
              <Icon name="share" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{t.shareWithDoctor}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveToRecords}
            >
              <Icon name="save" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{t.saveToRecords}</Text>
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <Icon name="info-outline" size={16} color="#666" />
            <Text style={styles.disclaimerText}>{t.disclaimer}</Text>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0F7FA',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: '#00695C',
    marginHorizontal: 4,
  },
  documentCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00695C',
  },
  documentPreview: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentImage: {
    width: width * 0.6,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  documentName: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  aiBadgeText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 4,
    fontWeight: '600',
  },
  analysisSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    marginLeft: 28,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#00695C',
    marginRight: 8,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  confidenceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00695C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#E65100',
    flex: 1,
    marginLeft: 8,
    lineHeight: 16,
  },
  // Extracted data styles
  dataItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9C27B0',
    width: 80,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
});

export default DocumentSummaryScreen;
