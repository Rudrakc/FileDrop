// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWtGqf4kAeGSdGYL7PD9CVxPx1LnrzteY",
  authDomain: "filedrop-d9d21.firebaseapp.com",
  projectId: "filedrop-d9d21",
  storageBucket: "filedrop-d9d21.appspot.com",
  messagingSenderId: "422862759986",
  appId: "1:422862759986:web:dfa1e8860aa3153b9cb42b",
  measurementId: "G-8BLEM78G46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage };