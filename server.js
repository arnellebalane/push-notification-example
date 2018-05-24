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
            icon: 'https://arnellebalane.com/icon-200.de1e83e888ee64a46fed4f7085956eb8.png',
            tag: 'server-notification'
        });

        const response = await webpush.sendNotification(subscription, payload);

        return json(response);
    })
]).then(ctx => {
    ctx.log.info(`Server is listening on port ${ctx.options.port}`);
});
