# HealSync 🏥

**Digital Health Records Management Platform**

HealSync is a modern, secure healthcare platform that simplifies medical record management and facilitates seamless communication between patients and healthcare providers. Built with React and Firebase, it offers a comprehensive solution for organizing health information and improving healthcare delivery.

## 🚀 What HealSync Does

HealSync bridges the gap between patients and healthcare providers by creating a centralized, secure platform for health data management. It eliminates the hassle of carrying paper medical records and enables instant access to comprehensive health information during medical visits.

### Core Problems We Solve

- **� Fragmented Medical Records**: No more lost paperwork or incomplete medical histories
- **🔒 Data Security Concerns**: Role-based access controls for secure data access
- **⏰ Time-Consuming Consultations**: Quick access to complete patient history for doctors
- **🤝 Poor Patient-Doctor Communication**: Streamlined sharing and collaboration tools
- **❓ Health Information Gaps**: AI-powered assistance for general health queries

## ✨ Key Features

### For Patients
- **🎯 Comprehensive Health Profiles**
  - Complete medical history, current medications, and allergies
  - Emergency contacts and accessibility requirements
  - Lifestyle data including diet, exercise, and habits

- **📱 Smart Doctor Sharing**
  - Simple Doctor ID system (DR-XXXX-1234 format)
  - One-click profile sharing with healthcare providers
  - Granular access control and easy revocation

- **🤖 AI Health Assistant**
  - 24/7 conversational health support
  - Medical term explanations and general guidance
  - Evidence-based health information with proper disclaimers

- **📊 Medical History Tracking**
  - Complete record of doctor visits and diagnoses
  - Prescription history and test results
  - Visual timeline of health events

### For Healthcare Providers
- **👥 Patient Management Dashboard**
  - View all shared patient profiles in one place
  - Quick access to comprehensive patient history
  - Unique Doctor ID for easy patient connection

- **📝 Medical Record Management**
  - Add detailed visit notes, diagnoses, and prescriptions
  - Real-time updates visible to patients

- **🔐 Secure Access Controls**
  - Role-based permissions and data access
  - Time-limited editing windows for data integrity

## 🛠 Technology Stack

- **Frontend**: React 19, React Router, Framer Motion
- **Styling**: Tailwind CSS, Custom themes (Light/Dark mode)
- **Backend**: Firebase (Authentication, Firestore, Security Rules)
- **AI Integration**: Google Gemini API for health assistance
- **Form Management**: React Hook Form
- **Icons**: React Icons
- **Build Tool**: Vite

## 🏗 Architecture Overview

```
├── Frontend (React)
│   ├── User Dashboard & Profiles
│   ├── Doctor Dashboard & Tools
│   ├── AI Health Assistant
│   └── Authentication & Onboarding
│
├── Backend (Firebase)
│   ├── Authentication & User Management
│   ├── Firestore Database
│   ├── Security Rules & Access Control
│   └── Real-time Data Synchronization
│
└── AI Services
    ├── Gemini API Integration
    ├── Health-focused Prompting
    └── Privacy-filtered Responses
```

## � Security & Privacy

- **🔒 Role-based Access**: Strict permissions based on user roles and sharing agreements
- **🚫 Privacy-first AI**: No personal medical data sent to AI services
- **⏰ Time-limited Access**: Automatic restrictions on data modification windows

## 📖 Usage Guide

### For Patients

1. **Sign Up & Onboarding**
   - Create account with email/password
   - Complete health profile during onboarding
   - Add medical history, medications, and emergency contacts

2. **Share with Doctors**
   - Get Doctor ID from your healthcare provider
   - Use "Share with Doctor" button on your profile
   - Manage access permissions as needed

3. **Use AI Assistant**
   - Click the AI chat button on your dashboard
   - Ask general health questions
   - Get explanations of medical terms

### For Healthcare Providers

1. **Doctor Registration**
   - Sign up with doctor role
   - Receive unique Doctor ID (DR-XXXX-1234)
   - Share your Doctor ID with patients

2. **Access Patient Profiles**
   - View all shared patient profiles on dashboard
   - Access complete medical history and current medications
   - Review previous visit notes from other providers

3. **Add Medical Records**
   - Navigate to patient's profile
   - Add visit notes, diagnoses, prescriptions
   - Records are immediately visible to the patient

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raghavvvgaba/healsync.git
   cd healsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Deploy security rules (see `firestore.rules`)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open http://localhost:5173 in your browser
