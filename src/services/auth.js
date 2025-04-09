// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Registro
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if(!docSnap.exists()){
    throw new Error("User not found in firebase");
  }

  return {
    user: userCredential.user,
    userData: docSnap.data()
  }
};

// Logout
export const logout = () => {
  return signOut(auth);
};

// Monitorar estado de login (opcional)
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
