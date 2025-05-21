import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config (from step 1)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
  // other values
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
