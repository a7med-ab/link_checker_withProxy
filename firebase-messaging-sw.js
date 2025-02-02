importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js");

// ✅ Replace with your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBjPUUhSBtjGOkGGEcvXIekV2bNlWvY2GE",
    authDomain: "proxy-server-virusapp.firebaseapp.com",
    projectId: "proxy-server-virusapp",
    storageBucket: "proxy-server-virusapp.appspot.com",
    messagingSenderId: "139174977888",
    appId: "1:139174977888:web:3978d22d16fda1b43cfe05",
    measurementId: "G-LT74K2T5JH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/firebase-logo.png",
    });
});
