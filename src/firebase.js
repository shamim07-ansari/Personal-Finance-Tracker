// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider } from "firebase/auth"; 
import {getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6n1nUgPo35Cdwk8L1EvbIpxGoq9GaQTQ",
  authDomain: "finance-tracker-e4485.firebaseapp.com",
  projectId: "finance-tracker-e4485",
  storageBucket: "finance-tracker-e4485.appspot.com",
  messagingSenderId: "980135716523",
  appId: "1:980135716523:web:923e711c8b3d1e1a20f9ee",
  measurementId: "G-BFTRNC991S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth (app); 
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc };