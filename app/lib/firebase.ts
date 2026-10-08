import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasRequiredConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

if (!hasRequiredConfig) {
  console.warn("Firebase config is missing. Add your Vite env values to .env.local");
}

let app;
let auth;
let googleProvider;

if (hasRequiredConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
}

export { auth, googleProvider };

export async function signInWithGoogle() {
  if (!hasRequiredConfig) {
    throw new Error(
      "Firebase is not configured. Add your Firebase config to the Vite environment variables."
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email: string, pass: string) {
  if (!hasRequiredConfig) {
    throw new Error("Firebase is not configured.");
  }
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function registerWithEmail(email: string, pass: string) {
  if (!hasRequiredConfig) {
    throw new Error("Firebase is not configured.");
  }
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return firebaseOnAuthStateChanged(auth, callback);
}

export type { User };
