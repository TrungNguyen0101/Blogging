import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAZjj17U5Yv-hN2EgtSuB-fTzNx0UckHqA",
    authDomain: "monkey-blogging-28e56.firebaseapp.com",
    projectId: "monkey-blogging-28e56",
    storageBucket: "monkey-blogging-28e56.appspot.com",
    messagingSenderId: "658021229256",
    appId: "1:658021229256:web:08737046bc1a8ba77c7bfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//      allow read, write: if request.auth != null;
//     }
//   }
// }