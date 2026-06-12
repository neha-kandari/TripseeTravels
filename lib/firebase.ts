import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCO6JHAe1O9qpb-dDuKS8K9NMPGYYaqZQU",
  authDomain: "tripsee-849eb.firebaseapp.com",
  projectId: "tripsee-849eb",
  storageBucket: "tripsee-849eb.firebasestorage.app",
  messagingSenderId: "16263885909",
  appId: "1:16263885909:web:84bd0e681a2f68bc3550dc",
  measurementId: "G-1FZDZMFXTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app; 