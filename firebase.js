import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "project-1234-1a50f.firebaseapp.com",
    projectId: "project-1234-1a50f",
    storageBucket: "project-1234-1a50f.appspot.com",
    messagingSenderId: "120358655463",
    appId: "1:120358655463:web:cdd097d79c3a1a506f1942",
    measurementId: "G-4DF863S8KM"
};

let db;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Get Firestore instance for the app
  db = getFirestore(app);
} catch (error) {
  // Handle the error or display a generic error message
  console.error("An error occurred during Firebase initialization:", error);
  // Display an error message on the screen or perform any necessary error handling
  // ...
}

export default db;
