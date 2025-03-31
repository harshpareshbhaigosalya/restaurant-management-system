import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB41apuKQR-WmuWfmOvhxYslDjPCAFMtro",
    authDomain: "skeleton-de5b2.firebaseapp.com",
    projectId: "skeleton-de5b2",
    storageBucket: "skeleton-de5b2.firebasestorage.app",
    messagingSenderId: "822545596382",
    appId: "1:822545596382:web:21f3ed974b701b889c674f"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  export { auth, googleProvider };
