// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW6Ua4l_8VvLACNkts9VtJFnz1LhNvEWU",
  authDomain: "emergencyalert-87b1b.firebaseapp.com",
  projectId: "emergencyalert-87b1b",
  storageBucket: "emergencyalert-87b1b.firebasestorage.app",
  messagingSenderId: "1062344697628",
  appId: "1:1062344697628:web:b681b31d23cb305d873cd9",
  measurementId: "G-VHEGJ82T8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);