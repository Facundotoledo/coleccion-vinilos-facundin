// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // Importa Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQvvRrnLaotAF32qtVJ8UUDflq2_f8UbM",
  authDomain: "vinyl-collection-a201a.firebaseapp.com",
  projectId: "vinyl-collection-a201a",
  storageBucket: "vinyl-collection-a201a.firebasestorage.app",
  messagingSenderId: "1028885539181",
  appId: "1:1028885539181:web:4d928efef3608fda399264",
  measurementId: "G-LSBHM95N5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);  // Inicia Firestore

// Export db to use it in other files
export { db };
