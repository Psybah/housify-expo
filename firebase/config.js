// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAekkEfu0IfkmZ3JNM9VMYHPo22vK14P78",
  authDomain: "housify-d7bb2.firebaseapp.com",
  projectId: "housify-d7bb2",
  storageBucket: "housify-d7bb2.firebasestorage.app",
  messagingSenderId: "703268732187",
  appId: "1:703268732187:web:8451e94f051990897167be",
  measurementId: "G-JKNGNBEB0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };