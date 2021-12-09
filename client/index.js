const client = (() => {
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
})()