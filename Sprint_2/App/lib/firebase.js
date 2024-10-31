// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics"; // Optional: Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2hvi5i-tuRY1YE3avfdglxCcy4M5qOfU",
  authDomain: "polo-36165.firebaseapp.com",
  projectId: "polo-36165",
  storageBucket: "polo-36165.appspot.com",
  messagingSenderId: "596689106269",
  appId: "1:596689106269:web:19656084a63ae1a2cfa4b4",
  measurementId: "G-28VLQFVRML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Optional: Initialize Analytics if running in the browser

export { db };
