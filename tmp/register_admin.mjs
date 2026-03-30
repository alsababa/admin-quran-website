
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyApVU3n1i3tUEXptdcqUikqNpo6R_kBm1Q",
  authDomain: "quran-b93a7.firebaseapp.com",
  projectId: "quran-b93a7",
  storageBucket: "quran-b93a7.firebasestorage.app",
  messagingSenderId: "124093948550",
  appId: "1:124093948550:web:67d7404dfe12fc3f1c2707"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "tec@alsababah.com";
const password = "Sababa-tec@2026";

console.log(`Attempting to register ${email}...`);

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("SUCCESS: User registered successfully.");
    console.log("User ID:", userCredential.user.uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR:", error.message);
    process.exit(1);
  });
