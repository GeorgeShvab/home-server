const button = document.getElementById("subscribe-button");

const publicKey =
  "BACnOaVOScMTbnC3vI8jP96AZc1PFKS6GpwLZ0UxWfS2LxHeYamIAPCv1_g9AIwLAgInsXwK4LD4x3L8lnD6-PY";

button.addEventListener("click", () => {
  navigator.serviceWorker.register("/service-worker.js");

  Notification.requestPermission();

  navigator.serviceWorker.ready.then((registration) => {
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      })
      .then((subscription) => {
        return fetch("/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });
      });
  });
});
