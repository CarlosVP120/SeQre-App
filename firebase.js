import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1H7QrOX-9GmSZO7QHKm7q0ZQzCxQyLWc",
  authDomain: "seqreapp.firebaseapp.com",
  databaseURL: "https://seqreapp-default-rtdb.firebaseio.com",
  projectId: "seqreapp",
  storageBucket: "seqreapp.appspot.com",
  messagingSenderId: "594053350379",
  appId: "1:594053350379:web:f5240b5afaec4c460c4fae",
  measurementId: "G-Q9CX48ZGFF",
};

// // initialize firebase app
// const app = initializeApp(firebaseConfig);

// // initialize auth
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// // initialize firestore

// export { auth };

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default getFirestore(app);
