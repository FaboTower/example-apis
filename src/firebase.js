import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDQSAzVVhvmMbQZJ7RgusQQBsnC7Q4GCeQ",
  authDomain: "example-api-d706f.firebaseapp.com",
  projectId: "example-api-d706f",
  storageBucket: "example-api-d706f.firebasestorage.app",
  messagingSenderId: "981972481289",
  appId: "1:981972481289:web:5796d7891605b3d8fc0fd8",
  measurementId: "G-DD6ZT4Z456"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);