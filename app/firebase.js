// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjtfIgXuDdonMFGacGzJ4dT2PAOP5KrP8",
  authDomain: "expense-tracker-cc2d6.firebaseapp.com",
  projectId: "expense-tracker-cc2d6",
  storageBucket: "expense-tracker-cc2d6.appspot.com",
  messagingSenderId: "245192067016",
  appId: "1:245192067016:web:a7e634ee5334ac7ae9a2fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// This line initializes and exports a Firestore database instance
// - 'getFirestore' is a function from Firebase that creates a Firestore instance
// - 'app' is the initialized Firebase app we created earlier
// - 'db' is the constant that holds our Firestore database instance
// We export it so we can use this database connection in other parts of our app
// Why is there const?
// - 'const' is used to declare a constant variable
// - 'db' is the name of the constant variable
// - 'getFirestore(app)' is the value assigned to the constant variable
// - 'getFirestore' is a function from Firebase that creates a Firestore instance
// - 'app' is the initialized Firebase app we created earlier

export const db = getFirestore(app);