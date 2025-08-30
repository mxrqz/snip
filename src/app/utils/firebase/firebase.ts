import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYfGQY_rJkjoY-X8o23bIu9syRCGnnxKI",
  authDomain: "momentum-9014e.firebaseapp.com",
  projectId: "momentum-9014e",
  storageBucket: "momentum-9014e.firebasestorage.app",
  messagingSenderId: "716654541344",
  appId: "1:716654541344:web:61a436a24048449cab1a45",
  measurementId: "G-QG8MLMY3P1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, analytics }
