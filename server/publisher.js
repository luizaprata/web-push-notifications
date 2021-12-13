const webPush = require('web-push');
const faker = require('faker');

const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cgpM2kf-o9I:APA91bGsFxoaA-YvOzeMUtmn3BIiWotLkpU3cwZNXOOBNGUJ9e1U6IIHd-oLnsgxFnW2GH6UnBeiXflxPUXmkBl_kk_vkL-oUHMFAOEwKUUsA4Zr9x8x6G9Weu9OnGIW94lJw5YEHYDc",
    "expirationTime": null,
    "keys": {
        "p256dh": "BCUxEO-k-xwq8TzNYrvVbvMGjJS2tEQWfZCt6pvbN1OznFSxdTbFCGOgcNfpVWo2imU8ybRamYKz5xVUCJs43do",
        "auth": "JutsLAPMx6UcqHQrRkm6JQ"
    }
}


const vapidPublicKey = 'BO7XgY8MGc0ZQxDCVxtv3E3No1nIYpgfb56SqryU_-xE-6WdFuoqmtMAHAwZiny-UGGuLb6r2Mjv8mSUUqjWP_o';
const vapidPrivateKey = 'wOwYawqO9j7s8Iw_uRkPzuSQOY-VC5FyTxrpuVCEcK4';

const options = {
    TTL: 60,
    vapidDetails: {
        subject: 'mailto: pushers@pushy.com',
        publicKey: vapidPublicKey,
        privateKey: vapidPrivateKey
    }
};

const notify = (subscribers) => {
    const transaction = faker.helpers.createTransaction()

    if (subscribers.size < 1) {
        console.log("No subscribers to notify");
        return;
    }

    subscribers.forEach((subscriber, id) => {
        webPush.sendNotification(
                subscriber,
                JSON.stringify(transaction),
                options
            )
            .then(() => console.log(`${subscribers.size} subscribers notified.`))
            .catch(error => console.error('Error in pushing notification', error))
    })
}

module.exports = {
    notify: notify
}