import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkEp198mYVdaGLdsINoWfgoTi3dpEpyWA",
  authDomain: "dva-logistics-app.firebaseapp.com",
  projectId: "dva-logistics-app",
  storageBucket: "dva-logistics-app.appspot.com",
  messagingSenderId: "185297254367",
  appId: "1:185297254367:web:96e63ea92f8e9f6fce366a",
  measurementId: "G-SLFSRSXM04"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app)