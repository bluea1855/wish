// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase AI imports
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCZ4um6XDUJ5pjSPUK11XNQCUIHow3VNA8",
  authDomain: "wish-a6bff.firebaseapp.com",
  projectId: "wish-a6bff",
  storageBucket: "wish-a6bff.appspot.com",
  messagingSenderId: "940691374593",
  appId: "1:940691374593:web:caceea9e3404ecba15f600",
  measurementId: "G-C4KXJR6SJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase AI
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create Generative Model instance for Gemini 1.5 Flash
const model = getGenerativeModel(ai, { model: "gemini-1.5-flash" });

const db = getFirestore(app);
const storage = getStorage(app);

export { db, model, storage };
