import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC0vugc9fu83Vk7YZK8h6ePAvHLvXfIHWU",
  authDomain: "prepwise-d88fe.firebaseapp.com",
  projectId: "prepwise-d88fe",
  storageBucket: "prepwise-d88fe.firebasestorage.app",
  messagingSenderId: "345838178455",
  appId: "1:345838178455:web:717a2a96fabca687a4d9d2",
  measurementId: "G-88Z752SD1K"
};

// Initialize Firebase
const app = !getApp.length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)
