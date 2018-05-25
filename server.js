require('dotenv').config();
const server = require('server');
const { get, post } = server.router;
const { json, render } = server.reply;
const webpush = require('web-push');

webpush.setVapidDetails(
    'https://arnellebalane.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

server([
    get('/', ctx => render('index.hbs', {
        vapidPublicKey: process.env.VAPID_PUBLIC_KEY
    })),

    post('/subscribe', async ctx => {
        const subscription = ctx.body;
        const payload = JSON.stringify({
            title: 'Hello there!',
            body: 'This is a test notification from the server.',
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
        });

        const response = await webpush.sendNotification(subscription, payload);

        return json(response);
    })
]).then(ctx => {
    ctx.log.info(`Server is listening on port ${ctx.options.port}`);
});
