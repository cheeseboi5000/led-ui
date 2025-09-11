import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALidTqHgEmHOl_VT6XglzVNktyDQL-aA4",
  authDomain: "led-ui-f781b.firebaseapp.com",
  databaseURL: "https://led-ui-f781b-default-rtdb.firebaseio.com",
  projectId: "led-ui-f781b",
  storageBucket: "led-ui-f781b.firebasestorage.app",
  messagingSenderId: "130301066650",
  appId: "1:130301066650:web:dba01572385abf3e3c0e23",
  measurementId: "G-BEJRH7PWQ9",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
const analytics = getAnalytics(app)
