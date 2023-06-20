// Open a connection to the IndexedDB database
const openDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sweet_hour", 1);

    // Handle database upgrade
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("data", { keyPath: "id" });
      objectStore.createIndex("name", "name", { unique: false });
    };

    // Handle successful database connection
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    // Handle database connection errors
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Add an item to the IndexedDB database
const addItem = async (item) => {
  const db = await openDb();
  const transaction = db.transaction("data", "readwrite");
  const objectStore = transaction.objectStore("data");
  objectStore.add(item);
};

// Get all items from the IndexedDB database
const getItems = async () => {
  const db = await openDb();
  const transaction = db.transaction("data", "readonly");
  const objectStore = transaction.objectStore("data");
  const items = await objectStore.getAll();
  return items;
};

// Delete an item from the IndexedDB database
const deleteItem = async (id) => {
  const db = await openDb();
  const transaction = db.transaction("data", "readwrite");
  const objectStore = transaction.objectStore("data");
  objectStore.delete(id);
};

// Install event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...", event);
  event.waitUntil(
    caches.open("sweet_hour").then((cache) => {
      console.log("[Service Worker] Precaching App Shell...");
      cache.addAll([
        "/",
        "/index.html",
        "/favicon.ico",
        "/logo180.png",
        "/logo512.png",
        "/maskable_icon.png",
      ]);
    })
  );
});

// Activate event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...", event);
  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.clients.claim());
});

// Fetch event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetching something...", event);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((res) => {
          return caches.open("sweet_hour").then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
