import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTc5vilYauo6b1TSuloW9pYE7ZdCwFXoA",
  authDomain: "qurasl.firebaseapp.com",
  projectId: "qurasl", 
  storageBucket: "qurasl.firebasestorage.app",
  messagingSenderId: "348094512381",
  appId: "1:348094512381:android:d8411b825d99ae61305294"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
