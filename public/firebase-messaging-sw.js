// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDHvp916WUfdYG-2L2auLQ_oeiLDrOAEiw",
    authDomain: "cari-hati.firebaseapp.com",
    projectId: "cari-hati",
    storageBucket: "cari-hati.appspot.com",
    messagingSenderId: "21649625637",
    appId: "1:21649625637:web:739539f5cbcaa4981065cc"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './icon-512x512.png',
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});