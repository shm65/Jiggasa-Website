document.addEventListener("DOMContentLoaded", () => {
    // Register Service Worker for PWA (Offline support on Android)
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
            .then(() => console.log("Service Worker registered successfully."))
            .catch(err => console.log("Service Worker registration failed:", err));
    }
});