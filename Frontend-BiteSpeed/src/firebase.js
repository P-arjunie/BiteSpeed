import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKKZkhEHIdPoCyY5SLBWoCjdkJeEgivXA",
  authDomain: "food-cfc21.firebaseapp.com",
  projectId: "food-cfc21",
  storageBucket: "food-cfc21.firebasestorage.app",
  messagingSenderId: "548423130515",
  appId: "1:548423130515:web:b3e849801987e36cc99c66",
  measurementId: "G-W5HTZTFPZD"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
