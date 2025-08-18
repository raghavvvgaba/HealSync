import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { generateUniqueDoctorId } from "../utils/firestoreDoctorService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user role from Firestore
        await fetchUserRole(firebaseUser.uid);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Step 2: Update Firebase profile
      await updateProfile(userCredential.user, { displayName: name });
      
      // Step 3: Generate doctor ID if the user is a doctor
      let doctorId = null;
      if (role === "doctor") {
        doctorId = await generateUniqueDoctorId();
      }
      
      // Step 4: Store user data in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userData = {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      
      // Add doctor ID if user is a doctor
      if (doctorId) {
        userData.doctorId = doctorId;
      }
      
      await setDoc(userDocRef, userData);
      
      // Update local state
      setUserRole(role);
      
      return userCredential;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
