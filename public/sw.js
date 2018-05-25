addEventListener('install', e => e.waitUntil(skipWaiting()));

addEventListener('activate', e => e.waitUntil(clients.claim()));

addEventListener('push', e => {
    const { title, ...data } = e.data.json() || {
        title: 'Notification Title',
        body: 'This is the notification body.',
        icon: '/assets/logo.png',
        badge: '/assets/badge.png',
        tag: 'client-notification'
    };

    e.waitUntil(
        registration.showNotification(title, data)
    );
});
