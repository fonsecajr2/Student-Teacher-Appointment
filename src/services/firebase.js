// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXnAZWzKpOkwh4-pKEbsohk-7H--lPHD8",
  authDomain: "school-teacher-appointment.firebaseapp.com",
  projectId: "school-teacher-appointment",
  storageBucket: "school-teacher-appointment.firebasestorage.app",
  messagingSenderId: "609130294459",
  appId: "1:609130294459:web:6893dffe4adecadce18d9e",
  measurementId: "G-J4ZYSXFDQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };