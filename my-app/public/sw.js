importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

let cacheFiles = [
  //any js,css and image files
  "todo.js",
  "todo.css",
  "img/*",
  {
    url: "./index.html",
    //the application will update it in cache if any changes
    resvision: "00000001",
  },
];
workbox.precaching.precacheAndRoute(cacheFiles);
