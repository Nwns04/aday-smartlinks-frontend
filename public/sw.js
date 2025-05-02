// public/sw.js
self.addEventListener("push", event => {
    let data = { title: "Notification", body: "You have a new click!" };
    if (event.data) {
      data = event.data.json();
    }
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        data: data.url
      })
    );
  });
  
  self.addEventListener("notificationclick", e => {
    e.notification.close();
    e.waitUntil(
      clients.openWindow(e.notification.data || "/")
    );
  });
  
  self.addEventListener('push', e => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png'
    });
  });