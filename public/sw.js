addEventListener('install', e => e.waitUntil(skipWaiting()));

addEventListener('activate', e => e.waitUntil(clients.claim()));

addEventListener('push', e => {
    const { title, ...data } = e.data.json() || {
        title: 'Notification Title',
        body: 'This is the notification body.',
        icon: '/assets/logo.png',
        badge: '/assets/badge.png',
        tag: 'main-notification',
        actions: [ {
            action: 'select-left',
            title: 'Choose Left',
            icon: '/assets/left.png'
        }, {
            action: 'select-right',
            title: 'Choose Right',
            icon: '/assets/right.png'
        } ]
    };

    e.waitUntil(
        registration.showNotification(title, data)
    );
});

addEventListener('notificationclick', e => {
    e.notification.close();

    let title = 'You clicked the notification!';
    const data = {
        body: 'You are awesome!',
        icon: '/assets/logo.png',
        badge: '/assets/badge.png'
    };

    if (e.notification.action === 'select-left') {
        title = 'You chose left!';
    } else if (e.notification.action === 'select-right') {
        title = 'You chose right!';
    }

    e.waitUntil(
        registration.showNotification(title, data)
    );
});
