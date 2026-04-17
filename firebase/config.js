import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ8doHDn6qTGRuoSvrmswYV8n4RzwUyJU",
  authDomain: "test-4e878.firebaseapp.com",
  projectId: "test-4e878",
  storageBucket: "test-4e878.appspot.com",
  messagingSenderId: "398279403515",
  appId: "1:398279403515:web:a2845a5281775b92d60d5e",
};

const app = initializeApp(firebaseConfig);

// 🔥 ГЛАВНЫЙ ФИКС
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // если уже инициализирован — просто берем существующий
  auth = getAuth(app);
}

export { auth };

export const db = getFirestore(app);