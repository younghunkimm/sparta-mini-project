import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXLowFr8AzZ4j4o91jtKGCYrrSgvlnwYc",
  authDomain: "food-fighter-be5cf.firebaseapp.com",
  projectId: "food-fighter-be5cf",
  storageBucket: "food-fighter-be5cf.firebasestorage.app",
  messagingSenderId: "408895238916",
  appId: "1:408895238916:web:767adba1bfd56aeada5651",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore, Storage 인스턴스 내보내기
export const db = getFirestore(app);
export const storage = getStorage(app);