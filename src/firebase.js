// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const cors = require('cors')({origin: true});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEOWJylp4kDmF-_T7ipTjKwedN1AXOB3I",
  authDomain: "fb-chat-app-81ea0.firebaseapp.com",
  projectId: "fb-chat-app-81ea0",
  storageBucket: "fb-chat-app-81ea0.firebasestorage.app",
  messagingSenderId: "970010209717",
  appId: "1:970010209717:web:cd5634c51b975448943dfc"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
