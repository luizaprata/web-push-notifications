


const client = (() => {

    function urlB64ToUint8Array(url) {
        const padding = '='.repeat((4 - url.length % 4) % 4);
        const base64 = (url + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }



    let serviceWorkerRegObj = undefined;

    const showNotification = () => {
        navigator.serviceWorker.getRegistration()
            .then(registration => registration.showNotification("ola", {
                body: "body message",
                icon: "imgs/notification.png",
                actions: [
                    { action: "search", title: "search" }
                ],
                data: {
                    notificationTime: Date.now(),
                    githubUser: "luizaprata"
                }
            }))
    }
    const notificationBtn = document.getElementById("btn-notify");
    const pushBtn = document.getElementById("btn-push");
    notificationBtn.addEventListener('click', showNotification)


    const checkNotificationSupport = () => {
        if (!('Notification' in window)) return Promise.reject("notification not supported")
        return Promise.resolve("ok")
    }
    const registerServiceWorker = () => {
        if (!('serviceWorker' in navigator)) return Promise.reject("service worker not supported")
        return navigator.serviceWorker.register('service-worker.js')
            .then(regObj => {
                console.log("service worker is registered succesfully!")
                serviceWorkerRegObj = regObj;
            })
    }

    const requestNotificationPermission = () => {
        return Notification.requestPermission(status => {
            console.log(`notification status ${status}`)
        })
    }

    checkNotificationSupport()
        .then(registerServiceWorker)
        .then(requestNotificationPermission)
        .catch(err => console.error(err))


    const setPush = () => {
        let loading = false

        pushBtn.addEventListener('click', () => {
            if (loading) return
            loading = true
            serviceWorkerRegObj.pushManager.getSubscription()
                .then(subs => {
                    if (subs) {
                        subs.unsubscribe()
                            .then(subscription => {
                                loading = false;
                                console.log('unsubscribed', subscription)
                            }).catch(error => console.error(error));
                    }
                    else {
                        const appServerPublicKey = "BO7XgY8MGc0ZQxDCVxtv3E3No1nIYpgfb56SqryU_-xE-6WdFuoqmtMAHAwZiny-UGGuLb6r2Mjv8mSUUqjWP_o"
                        const applicationServerKey = urlB64ToUint8Array(appServerPublicKey)
                        serviceWorkerRegObj.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey
                        }).then(subscription => {
                            loading = false;
                            console.log("subscribed", subscription)
                        }).catch(error => console.error(error));
                    }
                })
        })
    }
    setPush();

})()