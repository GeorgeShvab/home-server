self.addEventListener("push", (event) => {
  const data = event.data?.json();

  const title = data.desc.at(0).toUpperCase() + data.desc.slice(1);

  const body = `Температура: ${data.temp}°C, Вологість: ${data.humidity}%`;

  const options = {
    body: body,
    icon: "/favicon.svg",
    data: "/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
