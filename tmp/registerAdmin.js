import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// نستدعي الإعدادات الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyApVU3n1i3tUEXptdcqUikqNpo6R_kBm1Q",
    authDomain: "quran-b93a7.firebaseapp.com",
    databaseURL: "https://quran-b93a7-default-rtdb.firebaseio.com",
    projectId: "quran-b93a7",
    storageBucket: "quran-b93a7.firebasestorage.app",
    messagingSenderId: "124093948550",
    appId: "1:124093948550:web:67d7404dfe12fc3f1c2707"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function addAdmin() {
    try {
        console.log("جاري محاولة تسجيل الحساب...");
        const userCredential = await createUserWithEmailAndPassword(auth, "tec@alsababah.com", "Sababa-tec@2026");
        console.log("تم تفعيل وتفعيل حساب الأدمن بنجاح! UID:", userCredential.user.uid);
        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
             console.log("الحساب مسجل بالفعل! جاري التحقق من كلمة المرور...");
             try {
                 await signInWithEmailAndPassword(auth, "tec@alsababah.com", "Sababa-tec@2026");
                 console.log("تسجيل الدخول نجح، البيانات صحيحة 100%");
                 process.exit(0);
             } catch (loginError) {
                 console.error("كلمة المرور غير صحيحة أو هناك مشكلة:", loginError.message);
                 process.exit(1);
             }
        } else {
             console.error("حدث خطأ أثناء الإنشاء:", error.message, error.code);
             process.exit(1);
        }
    }
}

addAdmin();
