if (navigator.serviceWorker) {
    const button = document.querySelector('button');

    navigator.serviceWorker.register('sw.js')
        .then(() => updateButtonLabel(button));

    button.addEventListener('click', async () => {
        const [ error ] = await to(requestNotificationsPermission());

        if (error) {
            return console.error(error);
        }

        const subscription = await getPushNotificationSubscription();

        if (subscription) {
            await unsubscribeFromPushNotifications(subscription);
        } else {
            await subscribeToPushNotifications()
                .then(sendSubscriptionObjectToServer);
        }

        await updateButtonLabel(button);
    });
}

async function updateButtonLabel(button) {
    const subscription = await getPushNotificationSubscription();
    const buttonText = subscription
        ? 'Unsubscribe from push notifications'
        : 'Subscribe to push notifications';

    button.textContent = buttonText;
}

function requestNotificationsPermission() {
    const handlePermissionStatus = status => {
        if (['prompt', 'default'].includes(status)) {
            return Notification.requestPermission()
                .then(handlePermissionStatus);
        } else if (status !== 'granted') {
            throw new Error('Permission for notifications is denied.');
        }
    };

    return Promise.resolve(
        handlePermissionStatus(Notification.permission)
    );
}

async function getPushNotificationSubscription() {
    const registration = await navigator.serviceWorker.getRegistration();

    return registration.pushManager.getSubscription();
}

async function subscribeToPushNotifications() {
    const registration = await navigator.serviceWorker.getRegistration();

    return registration.pushManager.subscribe({
        applicationServerKey: urlBase64ToUint8Array(window.VAPID_PUBLIC_KEY),
        userVisibleOnly: true
    });
}

function unsubscribeFromPushNotifications(subscription) {
    return subscription.unsubscribe();
}

function sendSubscriptionObjectToServer(subscription) {
    return fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': window.CSRF_TOKEN
        },
        body: JSON.stringify(subscription.toJSON()),
        credentials: 'include'
    })
}

// Implementation is taken from
// https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

function to(promise) {
    return promise
        .then(result => [null, result])
        .catch(error => [error, null]);
}
