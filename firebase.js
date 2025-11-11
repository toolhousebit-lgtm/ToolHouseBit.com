// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFb6EfFBJ28V83gbmIHFJwInFYA3e6Xpw",
    authDomain: "toolhousebit-997be.firebaseapp.com",
    projectId: "toolhousebit-997be",
    storageBucket: "toolhousebit-997be.firebasestorage.app",
    messagingSenderId: "804791876419",
    appId: "1:804791876419:web:a54f5a6c7291bcc2240df6",
    measurementId: "G-7B4B8ZD8R6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.firebaseApp = app;
window.firebaseAuth = auth;
