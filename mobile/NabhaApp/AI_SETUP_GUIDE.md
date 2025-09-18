# AI Document Analysis Setup Guide

This guide will help you set up real AI-powered document analysis using Google's Gemini API.

## 🚀 Quick Setup

### Step 1: Get Your Free Gemini API Key

1. **Visit Google AI Studio**: Go to [https://ai.google.dev/](https://ai.google.dev/)
2. **Sign In**: Use your Google account to sign in
3. **Get API Key**: Click "Get API Key" button
4. **Create Project**: Create a new project or select an existing one
5. **Generate Key**: Click "Create API Key" and copy the generated key

### Step 2: Configure Your API Key

1. **Open the config file**: Navigate to `src/config/apiKeys.js`
2. **Replace the placeholder**: Replace `'AIzaSyBvQZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8'` with your actual API key
3. **Save the file**: The app will automatically use your API key

```javascript
export const API_KEYS = {
  GEMINI_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace this
};
```

### Step 3: Test the Integration

1. **Run the app**: `npm start`
2. **Upload a document**: Take a photo or select from gallery
3. **View analysis**: Click "View AI Analysis" to see real AI results

## 🆓 Free Tier Limits

Google Gemini API free tier includes:
- **15 requests per minute**
- **1 million tokens per day**
- **No credit card required**

## 🔧 Features

With real AI analysis, the app will:

### 📄 Document Type Detection
- Prescriptions
- Lab Reports
- X-Ray Reports
- Medical Certificates
- And more...

### 🔍 Content Analysis
- Extract text from images and PDFs
- Identify medical information
- Detect health conditions
- Provide recommendations

### 🎯 Smart Recommendations
- Doctor consultation suggestions
- Medication adherence tips
- Follow-up reminders
- Health monitoring advice

## 🛠️ Troubleshooting

### API Key Issues
- **Invalid Key**: Make sure you copied the complete API key
- **Quota Exceeded**: You've hit the free tier limits
- **Network Error**: Check your internet connection

### Analysis Issues
- **Poor Image Quality**: Ensure good lighting and clear text
- **Unsupported Format**: Use JPG, PNG, or PDF files
- **Large Files**: Keep files under 5MB for best results

## 🔒 Privacy & Security

- **Local Processing**: Images are sent to Google's secure servers
- **No Storage**: Google doesn't store your images permanently
- **Encrypted**: All communication is encrypted
- **Your Control**: You can revoke API access anytime

## 📱 Demo Mode

If you don't configure an API key, the app will run in demo mode with:
- Simulated analysis results
- Basic document type detection
- Standard medical recommendations
- Clear indication that it's demo mode

## 🆘 Support

If you need help:
1. Check the console logs for error messages
2. Verify your API key is correct
3. Ensure you have internet connectivity
4. Try with a different image

## 🎉 Success!

Once configured, you'll see:
- Real-time document analysis
- Accurate content extraction
- Personalized health insights
- Professional-grade recommendations

Your medical document analysis will be powered by Google's advanced AI technology!
