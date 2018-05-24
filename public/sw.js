addEventListener('install', e => e.waitUntil(skipWaiting()));

addEventListener('activate', e => e.waitUntil(clients.claim()));

addEventListener('push', e => {
    const { title, ...data } = e.data.json() || {
        title: 'Notification Title',
        body: 'This is the notification body.',
        icon: 'https://arnellebalane.com/icon-200.de1e83e888ee64a46fed4f7085956eb8.png',
        tag: 'client-notification'
    };

    e.waitUntil(
        registration.showNotification(title, data)
    );
});
