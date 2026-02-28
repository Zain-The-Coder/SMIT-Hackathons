import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyDUdmM5MOlMrC8uG0V-rQJHB_kFy-dPEoA",
  authDomain: "hackathon-project-9a89d.firebaseapp.com",
  projectId: "hackathon-project-9a89d",
  storageBucket: "hackathon-project-9a89d.firebasestorage.app",
  messagingSenderId: "943220838604",
  appId: "1:943220838604:web:6085d3798593c0bb6b7269",
  measurementId: "G-KPXTP9GH1M"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);