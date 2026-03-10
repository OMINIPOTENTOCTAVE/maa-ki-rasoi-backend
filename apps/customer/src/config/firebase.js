import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "maa-ki-rasoi-app-2026.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "maa-ki-rasoi-app-2026",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "maa-ki-rasoi-app-2026.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enforce local persistence for PWA silent auto-login
setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Failed to set Firebase Auth persistence:", err);
});
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
