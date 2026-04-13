// ── FIREBASE CONFIG ──
// Note: Firebase web API keys are safe to be public — access is protected by
// Firebase Security Rules, not by keeping the key secret.
const firebaseConfig = {
  apiKey:            "AIzaSyCBbbpJISOKiO582v7psfFU3Rhj7c8mINQ",
  authDomain:        "roshop-642dd.firebaseapp.com",
  projectId:         "roshop-642dd",
  storageBucket:     "roshop-642dd.firebasestorage.app",
  messagingSenderId: "865641860399",
  appId:             "1:865641860399:web:c6488dcecc9c828611e5da",
  measurementId:     "G-0QRC524CGY"
};

firebase.initializeApp(firebaseConfig);

// Auth and Firestore instances used across the whole app
const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = firebase.storage();
