import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "llm-chat-app-9c737.firebaseapp.com",
  projectId: "llm-chat-app-9c737",
  storageBucket: "llm-chat-app-9c737.appspot.com",
  messagingSenderId: "126894480667",
  appId: "1:126894480667:web:ecd46d912cec04f85707be"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);