# 🚀 Quick Setup Guide - AI Health Assistant

## ⏱️ 5-Minute Setup

### Step 1: Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace `your_gemini_api_key_here` with your actual API key:
   ```bash
   VITE_GEMINI_API_KEY=your_actual_key_here
   VITE_AI_ENABLED=true
   ```

### Step 3: Install Dependencies (Already Done)
```bash
npm install @google/generative-ai
```

### Step 4: Test the AI Assistant
1. Start development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Navigate to Dashboard (User or Doctor)

4. Click the AI Health Assistant button (blue robot icon)

5. Try these test questions:
   - "What is diabetes?"
   - "How much water should I drink daily?"
   - "What are the symptoms of flu?"

## 🎯 What You'll See

### User Dashboard
- **AI Widget**: Right sidebar with "AI Health Assistant" card
- **Floating Button**: Bottom-right corner (mobile)
- **Features**: Health questions, symptom understanding, wellness tips

### Doctor Dashboard  
- **AI Widget**: Right sidebar with "AI Health Assistant" card
- **Floating Button**: Bottom-right corner (mobile)
- **Features**: Medical reference, condition explanations, treatment info

### Chat Interface
- **Welcome Message**: Introduction and capabilities
- **Suggested Questions**: Quick-start health topics
- **Health Tips**: Daily wellness reminders
- **Real-time Responses**: Streaming AI responses
- **Medical Disclaimers**: Automatic safety notices

## 🔧 Troubleshooting

### AI Not Working?
1. **Check API Key**: Ensure it's correctly set in `.env`
2. **Restart Server**: After changing `.env`, restart `npm run dev`
3. **Check Console**: Open browser dev tools for error messages
4. **Test Connection**: AI will show error if service unavailable

### Common Issues

#### "API key not configured"
- Solution: Check `.env` file exists and has correct key
- Restart development server after changes

#### "Service unavailable"
- Solution: Check internet connection and Gemini API status
- Verify API key is valid and not exceeded quota

#### "Safety filters"
- Solution: Rephrase question to be more general
- Avoid asking for specific medical diagnoses

## 🎨 Customization

### Disable AI Features
Set in `.env`:
```bash
VITE_AI_ENABLED=false
```

### Change AI Model
Available models:
```bash
VITE_AI_MODEL_NAME=gemini-1.5-flash    # Faster, cheaper
VITE_AI_MODEL_NAME=gemini-1.5-pro      # More capable, slower
```

### Modify System Prompts
Edit `src/services/aiHealthAssistant.js`:
- Look for `HEALTH_SYSTEM_PROMPT`
- Customize AI behavior and responses

## 📱 Usage Tips

### For Patients
- Ask general health questions
- Get explanations of medical terms
- Understand symptoms (general info only)
- Learn about healthy lifestyle choices
- Always consult doctors for specific medical advice

### For Doctors
- Quick medical reference lookups
- Patient education material
- Treatment guideline reminders
- General medical information
- Research support (general knowledge)

## 🔒 Privacy & Security

### What's Safe
- ✅ General health questions
- ✅ Medical term explanations
- ✅ Lifestyle advice requests
- ✅ Symptom understanding (general)

### What to Avoid
- ❌ Personal medical records
- ❌ Patient names or identifiers
- ❌ Specific diagnoses for individuals
- ❌ Prescription decisions
- ❌ Emergency medical situations

## 📞 Support

### Getting Help
1. **Documentation**: Read `AI_INTEGRATION_GUIDE.md`
2. **Console Logs**: Check browser developer tools
3. **Error Messages**: AI provides helpful error explanations
4. **Fallback Mode**: Always works without AI enabled

### Emergency Notice
If someone mentions emergency symptoms:
- Chest pain, difficulty breathing, severe bleeding
- AI automatically provides emergency response
- Directs to call 911 immediately
- Does not attempt to provide medical advice

---

🎉 **Congratulations!** Your AI Health Assistant is now ready to help users with general health information and support.

*For detailed technical documentation, see `AI_INTEGRATION_GUIDE.md`*
