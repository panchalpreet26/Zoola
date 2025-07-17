import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMJkKkU8exR4-8E-xVUfKZNRZPGkSkhS0",
  authDomain: "zulas-5acb8.firebaseapp.com",
  projectId: "zulas-5acb8",
  storageBucket: "zulas-5acb8.appspot.com", // ✅ Fixed .firebasestorage.app to .appspot.com
  messagingSenderId: "990877240347",
  appId: "1:990877240347:web:ba6cc7818e783b3ae87cbe",
  measurementId: "G-HXMKSTJMGY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged, // ✅ now exported properly
};
