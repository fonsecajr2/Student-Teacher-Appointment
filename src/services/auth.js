// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import logger from "../utils/logger.js";

// Registro
export const signUp = async (email, password) => {
  logger.info(`Attempting to sign up user with email: ${email}`);
  const result = await createUserWithEmailAndPassword(auth, email, password);
  logger.info(`User signed up with email: ${email}, uid: ${result.user.uid}`);
  return result;
};

// Login
export const login = async (email, password) => {
  logger.info(`Attempting to log in user with email: ${email}`);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if(!docSnap.exists()){
    logger.error(`User not found in firebase for uid: ${uid}`);
    throw new Error("User not found in firebase");
  }

  logger.info(`User logged in with email: ${email}, uid: ${uid}`);

  return {
    user: userCredential.user,
    userData: docSnap.data()
  }
};

// Logout
export const logout = async () => {
  logger.info(`User logging out`);
  return signOut(auth);
};

// Monitorar estado de login (opcional)
export const onAuthChange = (callback) => {
  logger.info(`Setting up auth state change listener`);
  return onAuthStateChanged(auth, callback);
};
