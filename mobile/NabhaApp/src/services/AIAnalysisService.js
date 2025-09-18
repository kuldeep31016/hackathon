import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
import { API_KEYS } from '../config/apiKeys';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);

export class AIAnalysisService {
  // Test function to verify API key is working
  static async testAPIKey() {
    try {
      console.log('Testing Gemini API key...');
      
      // Check if API key is configured
      if (!API_KEYS.GEMINI_API_KEY || API_KEYS.GEMINI_API_KEY.length < 30) {
        console.error('API key not configured or too short');
        return false;
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Hello, are you working?");
      const response = await result.response;
      const text = response.text();
      
      console.log('API Test successful:', text);
      return true;
    } catch (error) {
      console.error('API Test failed:', error);
      console.error('Error details:', error.message);
      
      // Parse common error types
      if (error.message.includes('API_KEY_INVALID')) {
        console.error('The API key is invalid or malformed');
      } else if (error.message.includes('PERMISSION_DENIED')) {
        console.error('API key does not have permission to access Gemini API');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        console.error('API quota exceeded - wait before trying again');
      }
      
      return false;
    }
  }

  // Enhanced test function for image analysis
  static async testImageAnalysis(imageUri, fileName) {
    try {
      console.log('=== TESTING IMAGE ANALYSIS ===');
      console.log('Image URI:', imageUri);
      console.log('File name:', fileName);
      
      // First test API key
      const keyValid = await this.testAPIKey();
      if (!keyValid) {
        console.log('API key test failed - cannot proceed with image analysis');
        return null;
      }
      
      const result = await this.analyzeMedicalDocument(imageUri, fileName);
      
      console.log('=== ANALYSIS RESULT ===');
      console.log('Document Type:', result.documentType);
      console.log('Key Findings:', result.keyFindings);
      console.log('Health Issues:', result.healthIssues);
      console.log('Recommendations:', result.recommendations);
      console.log('Confidence:', result.confidence);
      console.log('Summary:', result.summary.substring(0, 100) + '...');
      console.log('Request ID:', result.requestId);
      console.log('=== END TEST ===');
      
      return result;
    } catch (error) {
      console.error('Image analysis test failed:', error);
      return null;
    }
  }

  static async analyzeMedicalDocument(imageUri, fileName) {
    try {
      console.log('=== STARTING DOCUMENT ANALYSIS ===');
      console.log('File:', fileName);
      console.log('URI:', imageUri);
      
      // Check if API key is properly configured
      if (!API_KEYS.GEMINI_API_KEY || API_KEYS.GEMINI_API_KEY.length < 30) {
        console.warn('Using demo mode — GEMINI_API_KEY not configured or invalid');
        return this.createDemoAnalysis(fileName);
      }
      
      console.log('Using real Gemini API (key present)');
      
      // Step 1: Extract text from image using Gemini's OCR capabilities
      console.log('Step 1: Extracting text from image...');
      const extractedText = await this.extractTextFromImage(imageUri, fileName);
      console.log('Extracted text length:', extractedText.length);
      console.log('OCR extracted text (first 1000 chars):', extractedText.substring(0, 1000));
      
      if (!extractedText || extractedText.trim().length < 20) {
        console.warn('Low OCR output length — continuing to fallback image analysis');
        return this.analyzeImageDirectly(imageUri, fileName);
      }
      
      // Step 2: Preprocess the extracted text
      console.log('Step 2: Preprocessing extracted text...');
      const cleanedText = this.preprocessText(extractedText);
      console.log('Cleaned text length:', cleanedText.length);
      console.log('Cleaned text preview:', cleanedText.substring(0, 200) + '...');
      
      // Step 3: Generate unique request ID to prevent caching
      const requestId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      console.log('Request ID:', requestId);
      
      // Step 4: Create structured prompt with extracted text
      console.log('Step 4: Creating analysis prompt...');
      const prompt = this.createAnalysisPrompt(cleanedText, requestId);
      console.log('Prompt length:', prompt.length);
      console.log('Prompt preview (first 500 chars):', prompt.substring(0, 500));
      
      // Step 5: Call Gemini API with text-based analysis
      console.log('Step 5: Calling Gemini API for text analysis...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(prompt, {
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 2048,
        }
      });
      
      const response = await result.response;
      const analysisText = response.text();
      
      console.log('Raw analysis response:', analysisText);
      console.log('Response length:', analysisText.length);
      console.log('Response preview (first 1000 chars):', analysisText.substring(0, 1000));
      
      // Step 6: Parse and validate the response
      console.log('Step 6: Parsing analysis response...');
      const analysis = this.parseAnalysisResponse(analysisText, fileName, requestId);
      
      console.log('=== ANALYSIS COMPLETE ===');
      return analysis;
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.createErrorAnalysis(error.message);
    }
  }

  // Step 1: Extract text from image using Gemini's OCR
  static async extractTextFromImage(imageUri, fileName) {
    try {
      console.log('Extracting text from image...');
      console.log('Image URI:', imageUri);
      console.log('File name:', fileName);
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const mimeType = this.getMimeType(fileName);
      console.log('MIME type:', mimeType);
      
      // Read the image file
      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('Image base64 length:', imageBase64.length || 0);
      
      // Check for valid base64
      if (!imageBase64 || imageBase64.length < 100) {
        console.warn('Image base64 looks too small — possible read failure');
        throw new Error('Failed to read image file');
      }
      
      const ocrPrompt = `Extract ALL text from this image. Return only the raw text content, nothing else. If you see any medical information, prescriptions, lab results, or certificates, include all the text exactly as it appears.`;
      console.log('OCR prompt:', ocrPrompt);
      
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        { text: ocrPrompt },
      ], {
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 2048,
        }
      });
      
      const response = await result.response;
      const extractedText = response.text();
      
      console.log('OCR completed, extracted text length:', extractedText.length);
      console.log('OCR response preview:', extractedText.substring(0, 500));
      return extractedText;
      
    } catch (error) {
      console.error('OCR Error:', error);
      console.error('OCR Error details:', error.message);
      return '';
    }
  }

  // Step 2: Preprocess extracted text
  static preprocessText(text) {
    if (!text) return '';
    
    console.log('Preprocessing text...');
    
    // Clean up the text with corrected regex patterns
    let cleaned = text
      .replace(/\r\n/g, '\n')                    // normalize CRLF
      .replace(/\n{2,}/g, '\n')                  // collapse multiple newlines
      .replace(/[ \t]+/g, ' ')                   // normalize spaces/tabs
      .replace(/[^\w\s\n.,;:!?()\/'":-]/g, '')   // remove strange special chars but keep punctuation
      .trim();
    
    // Normalize dates and uppercase acronyms
    cleaned = cleaned
      .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, 'DATE_PLACEHOLDER') // dates
      .replace(/\b[A-Z]{2,}\b/g, (m) => m.toLowerCase()) // acronyms -> lowercase
      .replace(/\b(patient|doctor|physician|dr\.?)\b/gi, (m) => m.toLowerCase());
    
    console.log('Text preprocessing completed');
    return cleaned;
  }

  // Step 3: Create structured analysis prompt
  static createAnalysisPrompt(extractedText, requestId) {
    return `You are a medical document analyzer. Analyze the following extracted text from a medical document and provide a structured analysis.

EXTRACTED TEXT:
${extractedText}

REQUEST ID: ${requestId}

Please analyze this text and provide your response in this EXACT JSON format:
{
  "documentType": "Type of document (e.g., Prescription, Lab Report, X-Ray Report, Medical Certificate, Medicine Bottle, etc.)",
  "keyFindings": ["List 3-5 specific findings from the text"],
  "healthIssues": ["List 2-4 health conditions or issues mentioned"],
  "recommendations": ["List 3-5 medical recommendations or next steps"],
  "confidence": 85,
  "summary": "A comprehensive 2-3 paragraph summary of the document content and medical significance",
  "extractedData": {
    "patientName": "Patient name if found",
    "date": "Date if found", 
    "physician": "Doctor/physician name if found",
    "medications": ["List of medications if any"],
    "diagnosis": "Diagnosis or condition if found"
  }
}

IMPORTANT: 
- Base your analysis ONLY on the extracted text above
- If information is not present in the text, mark as "Not found" or "Not specified"
- Be specific about what you can actually read from the text
- If this is not a medical document, indicate that clearly
- Return ONLY the JSON, no additional text`;
  }

  // Step 4: Parse analysis response
  static parseAnalysisResponse(responseText, fileName, requestId) {
    try {
      console.log('Parsing analysis response...');
      
      // Try direct parse first (if model returned JSON only)
      try {
        const trimmed = responseText.trim();
        const obj = JSON.parse(trimmed);
        console.log('Response was valid JSON directly');
        return this.validateAndFormatAnalysis(obj, fileName, requestId);
      } catch (directErr) {
        // Not directly JSON — try to extract the first {...} block
        const match = responseText.match(/\{[\s\S]*?\}/);
        if (!match) throw new Error('No JSON object found in response');
        
        const jsonString = match[0];
        console.log('Extracted JSON string:', jsonString.substring(0, 200) + '...');
        
        const analysis = JSON.parse(jsonString);
        return this.validateAndFormatAnalysis(analysis, fileName, requestId);
      }
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      console.error('Response text was:', responseText.substring(0, 500) + '...');
      return this.createFallbackAnalysis(responseText, fileName);
    }
  }

  // Helper to validate and format analysis
  static validateAndFormatAnalysis(analysis, fileName, requestId) {
    const validated = {
      documentType: analysis.documentType || this.detectDocumentType(fileName),
      keyFindings: Array.isArray(analysis.keyFindings) ? analysis.keyFindings : ['Analysis completed'],
      healthIssues: Array.isArray(analysis.healthIssues) ? analysis.healthIssues : ['Medical review recommended'],
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : ['Consult healthcare provider'],
      confidence: typeof analysis.confidence === 'number' ? Math.min(100, Math.max(0, analysis.confidence)) : 80,
      summary: analysis.summary || 'Document analysis completed. Please consult with a healthcare professional.',
      extractedData: Object.assign({}, analysis.extractedData || {}),
      requestId,
      timestamp: new Date().toISOString()
    };
    console.log('Successfully validated analysis:', validated);
    return validated;
  }

  // Fallback: Direct image analysis if OCR fails
  static async analyzeImageDirectly(imageUri, fileName) {
    try {
      console.log('Performing direct image analysis...');
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const mimeType = this.getMimeType(fileName);
      
      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const prompt = `Analyze this medical document image. What type of document is this? What information can you see? Provide a brief analysis in JSON format:
{
  "documentType": "Document type",
  "keyFindings": ["What you can see"],
  "healthIssues": ["Health information visible"],
  "recommendations": ["Recommendations"],
  "confidence": 70,
  "summary": "Brief summary of what you can see in the image"
}

Return ONLY the JSON, no additional text.`;

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        { text: prompt },
      ], {
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 1024,
        }
      });
      
      const response = await result.response;
      const text = response.text();
      
      return this.parseAnalysisResponse(text, fileName, 'direct_' + Date.now());
      
    } catch (error) {
      console.error('Direct image analysis failed:', error);
      return this.createErrorAnalysis(error.message);
    }
  }

  // Utility: Test API key with user-friendly response
  static async checkAPIKeyStatus() {
    console.log('Checking API key status...');
    
    if (!API_KEYS.GEMINI_API_KEY) {
      return {
        isValid: false,
        message: 'No API key configured',
        details: 'Please add your Gemini API key to src/config/apiKeys.js'
      };
    }
    
    if (API_KEYS.GEMINI_API_KEY.length < 30) {
      return {
        isValid: false,
        message: 'API key appears too short',
        details: 'Gemini API keys are typically 39+ characters long'
      };
    }
    
    try {
      const result = await this.testAPIKey();
      if (result) {
        return {
          isValid: true,
          message: 'API key is valid and working',
          details: 'Ready for real-time AI analysis'
        };
      } else {
        return {
          isValid: false,
          message: 'API key test failed',
          details: 'Check console for detailed error messages'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        message: 'API key validation error',
        details: error.message
      };
    }
  }

  static getMimeType(fileName) {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'image/jpeg';
    }
  }

  static createFallbackAnalysis(text, fileName) {
    return {
      documentType: this.detectDocumentType(fileName),
      keyFindings: [
        'Document analysis completed',
        'Content has been processed',
        'Medical information detected'
      ],
      healthIssues: [
        'Document contains medical information',
        'Professional review recommended'
      ],
      recommendations: [
        'Consult with healthcare provider',
        'Keep document for medical records',
        'Follow up as needed'
      ],
      confidence: 75,
      summary: `Document analysis completed. ${text.substring(0, 200)}...`,
      extractedData: {},
      requestId: 'fallback_' + Date.now(),
      timestamp: new Date().toISOString()
    };
  }

  static createErrorAnalysis(errorMessage) {
    return {
      documentType: 'Analysis Failed',
      keyFindings: ['Unable to analyze document'],
      healthIssues: ['Analysis unavailable'],
      recommendations: ['Please try again or consult a healthcare professional'],
      confidence: 0,
      summary: `Document analysis failed: ${errorMessage}. Please try uploading again or consult with a healthcare professional.`,
      extractedData: {},
      requestId: 'error_' + Date.now(),
      timestamp: new Date().toISOString()
    };
  }

  static createDemoAnalysis(fileName) {
    const docType = this.detectDocumentType(fileName);
    const timestamp = new Date().toLocaleDateString();
    
    return {
      documentType: docType,
      keyFindings: [
        'Document appears to be a medical record',
        'Contains patient information and medical data',
        'Text is clearly readable and well-formatted',
        'Document quality is suitable for medical review',
        'Professional analysis recommended'
      ],
      healthIssues: [
        'Medical documentation reviewed',
        'Professional consultation recommended',
        'Follow-up may be required',
        'Keep for medical records'
      ],
      recommendations: [
        'Share this document with your healthcare provider',
        'Keep a copy for your medical records',
        'Follow up as recommended by your doctor',
        'Schedule consultation if needed'
      ],
      confidence: 75,
      summary: `This appears to be a ${docType.toLowerCase()} containing important medical information. The document is clearly readable and contains structured medical data that should be reviewed by a qualified healthcare professional.

Key Points:
• Document quality is suitable for medical review
• Contains patient information and medical data
• Professional consultation is recommended
• Keep this document for your medical records

This analysis is for informational purposes only and should not replace professional medical advice. Please consult with your healthcare provider for proper interpretation and treatment recommendations.

Note: This is a demo analysis. To get real AI-powered analysis, please configure your Gemini API key in src/config/apiKeys.js`,
      extractedData: {
        patientName: "Not found",
        date: timestamp,
        physician: "Not found",
        medications: [],
        diagnosis: "Not found"
      },
      requestId: 'demo_' + Date.now(),
      timestamp: new Date().toISOString()
    };
  }

  static detectDocumentType(fileName) {
    const name = fileName.toLowerCase();
    if (name.includes('prescription') || name.includes('rx')) return 'Prescription';
    if (name.includes('lab') || name.includes('blood') || name.includes('test')) return 'Lab Report';
    if (name.includes('xray') || name.includes('x-ray')) return 'X-Ray Report';
    if (name.includes('mri') || name.includes('scan')) return 'MRI/Scan Report';
    if (name.includes('ecg') || name.includes('ekg')) return 'ECG Report';
    if (name.includes('ultrasound') || name.includes('sonography')) return 'Ultrasound Report';
    if (name.includes('certificate') || name.includes('medical')) return 'Medical Certificate';
    return 'Medical Document';
  }
}