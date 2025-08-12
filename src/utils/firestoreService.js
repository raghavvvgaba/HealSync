import { getFirestore, collection, addDoc, getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";

// Updated function to add/update profile data for a user incrementally
// This function now uses { merge: true } to merge the incoming profileData with any existing document data
export async function addUserProfile(userId, profileData) {
  try {
    console.log("Attempting to save to Firestore:", { userId, profileData });
    console.log("Current auth user:", auth.currentUser);
    console.log("Auth state:", auth.currentUser ? "authenticated" : "not authenticated");
    
    // The profileData can be a partial object containing just the section to update, e.g. { basic: {...} } or { medical: {...} }
  await setDoc(doc(db, "userProfile", userId), profileData, { merge: true });
    console.log("Successfully saved to Firestore");
    return { success: true };
  } catch (error) {
    console.error("Error adding/updating user profile:", error);
    console.error("Error details:", error.code, error.message);
    return { success: false, error: error.message };
  }
}

export async function getUserProfile(userId) {
  try {
  const docRef = doc(db, "userProfile", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function editUserProfile(userId, profileData) {
  try {
    // Use updateDoc to update specific fields in the user profile
  await updateDoc(doc(db, "userProfile", userId), profileData);
    return { success: true };
  } catch (error) {
    console.error("Error editing user profile:", error);
    return { success: false, error: error.message };
  }
}