import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQytu-lE-Uq44tTJcEayEd7JXEXWYFeAE",
  authDomain: "chat-ae5f0.firebaseapp.com",
  projectId: "chat-ae5f0",
  storageBucket: "chat-ae5f0.appspot.com",
  messagingSenderId: "230147852834",
  appId: "1:230147852834:web:0ddd93403682b7ae41187b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
