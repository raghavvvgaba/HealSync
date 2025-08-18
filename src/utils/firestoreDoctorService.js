import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Generates a human-readable doctor ID in the format: DR-XXXX-YYYY
 * Where XXXX is a 4-letter combination and YYYY is a 4-digit number
 */
export function generateDoctorId() {
  // Array of consonants and vowels for better readability
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  const vowels = 'AEIOU';
  
  // Generate 4-letter combination (consonant-vowel pattern for readability)
  let letters = '';
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      // Even positions: consonants
      letters += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      // Odd positions: vowels
      letters += vowels[Math.floor(Math.random() * vowels.length)];
    }
  }
  
  // Generate 4-digit number
  const numbers = Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits
  
  return `DR-${letters}-${numbers}`;
}

/**
 * Checks if a doctor ID already exists in the database
 * @param {string} doctorId - The doctor ID to check
 * @returns {Promise<boolean>} - True if ID exists, false otherwise
 */
export async function isDoctorIdExists(doctorId) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("doctorId", "==", doctorId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking doctor ID:", error);
    throw error;
  }
}

/**
 * Generates a unique doctor ID by checking against existing IDs
 * @returns {Promise<string>} - A unique doctor ID
 */
export async function generateUniqueDoctorId() {
  let doctorId;
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops
  
  do {
    doctorId = generateDoctorId();
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error("Unable to generate unique doctor ID after multiple attempts");
    }
  } while (await isDoctorIdExists(doctorId));
  
  return doctorId;
}

/**
 * Validates if a doctor ID follows the correct format
 * @param {string} doctorId - The doctor ID to validate
 * @returns {boolean} - True if valid format, false otherwise
 */
export function validateDoctorIdFormat(doctorId) {
  const pattern = /^DR-[BCDFGHJKLMNPQRSTVWXYZAEIOU]{4}-\d{4}$/;
  return pattern.test(doctorId);
}

/**
 * Finds a doctor by their doctor ID
 * @param {string} doctorId - The doctor ID to search for
 * @returns {Promise<Object|null>} - Doctor data if found, null otherwise
 */
export async function findDoctorByDoctorId(doctorId) {
  try {
    if (!validateDoctorIdFormat(doctorId)) {
      throw new Error("Invalid doctor ID format");
    }
    
    const usersRef = collection(db, "users");
    const q = query(
      usersRef, 
      where("doctorId", "==", doctorId),
      where("role", "==", "doctor")
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data()
    };
  } catch (error) {
    console.error("Error finding doctor by ID:", error);
    throw error;
  }
}

/**
 * Gets a shared profile record and validates doctor access
 * @param {string} shareId - The share ID in format doctorId_patientId
 * @param {string} doctorId - The doctor's user ID for validation
 * @returns {Promise<Object>} - Success/error result with share record
 */
export async function getSharedProfileRecord(shareId, doctorId) {
  try {
    // Verify shareId format is doctorId_patientId
    const shareIdParts = shareId.split('_');
    if (shareIdParts.length !== 2) {
      return { success: false, error: "Invalid share link format." };
    }

    const [shareIdDoctorId, patientId] = shareIdParts;
    
    // Verify the current user is the authorized doctor
    if (shareIdDoctorId !== doctorId) {
      return { success: false, error: "You are not authorized to view this patient's profile." };
    }

    // Fetch the share record to verify it exists and is active
    const shareDocRef = doc(db, "shared_profiles", shareId);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) {
      return { success: false, error: "Shared profile not found." };
    }

    const shareData = shareDoc.data();
    
    // Double-check authorization and status
    if (shareData.doctorId !== doctorId) {
      return { success: false, error: "You are not authorized to view this patient's profile." };
    }

    if (shareData.status !== 'active') {
      return { success: false, error: "This patient profile is no longer shared with you." };
    }

    return { success: true, data: shareData };
  } catch (error) {
    console.error("Error fetching shared profile record:", error);
    return { success: false, error: "Failed to load patient profile. Please try again." };
  }
}

/**
 * Gets patient basic information (name, email) from users collection
 * @param {string} patientId - The patient's user ID
 * @returns {Promise<Object>} - Success/error result with patient info
 */
export async function getPatientBasicInfo(patientId) {
  try {
    const userDocRef = doc(db, "users", patientId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        success: true,
        data: {
          name: userData.name || 'Unknown Patient',
          email: userData.email || ''
        }
      };
    } else {
      return { success: false, error: "Patient information not found." };
    }
  } catch (error) {
    console.error("Error fetching patient basic info:", error);
    return { success: false, error: "Failed to load patient information." };
  }
}

/**
 * Gets complete patient profile data
 * @param {string} patientId - The patient's user ID
 * @returns {Promise<Object>} - Success/error result with patient profile
 */
export async function getPatientProfile(patientId) {
  try {
    const patientDocRef = doc(db, "userProfile", patientId);
    const patientDoc = await getDoc(patientDocRef);
    
    if (patientDoc.exists()) {
      return { success: true, data: patientDoc.data() };
    } else {
      return { success: false, error: "Patient profile not found." };
    }
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return { success: false, error: "Failed to load patient profile." };
  }
}
