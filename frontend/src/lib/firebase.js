import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "infographai-dev.firebaseapp.com",
    databaseURL: "https://infographai-dev.firebaseio.com",
    projectId: "infographai-dev",
    storageBucket: "infographai-dev.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getDatabase(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export { auth, db, functions, storage };
