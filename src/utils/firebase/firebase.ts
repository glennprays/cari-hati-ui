import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "your_keys",
    authDomain: "your_keys",
    projectId: "your_keys",
    storageBucket: "your_keys",
    messagingSenderId: "your_keys",
    appId: "your_keys",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
