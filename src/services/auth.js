// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./firebase";

// Registro
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const logout = () => {
  return signOut(auth);
};

// Monitorar estado de login (opcional)
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
