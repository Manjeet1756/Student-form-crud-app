import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuU-HKZCdTHpQwCmRjMg-c6ofQ2ckPsIQ",
  authDomain: "studentform-bd16d.firebaseapp.com",
  projectId: "studentform-bd16d",
  storageBucket: "studentform-bd16d.appspot.com",
  messagingSenderId: "818536933386",
  appId: "1:818536933386:web:a50f8a79ab9ab97ae2d7f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db =  getFirestore(app);
export  {db};
