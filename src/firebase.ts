import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxtEPesXvKGlEcMHWxNU7CqLj0kxCgzw4",
  authDomain: "pad-dff16.firebaseapp.com",
  projectId: "pad-dff16",
  storageBucket: "pad-dff16.firebasestorage.app",
  messagingSenderId: "196302039372",
  appId: "1:196302039372:web:00197d2680cbdcd30007e9",
  measurementId: "G-B22EBZ1FX3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
