import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAV-gAtvlkYFVH7HfY-aLTvI0Itw6e9egs',
    authDomain: 'finder-1029c.firebaseapp.com',
    projectId: 'finder-1029c',
    storageBucket: 'finder-1029c.firebasestorage.app',
    messagingSenderId: '796181553949',
    appId: '1:796181553949:web:55e0819cee80ae57ebb7f4',
    measurementId: 'G-25QX201CH0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth export
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
