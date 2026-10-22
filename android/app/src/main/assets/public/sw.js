/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "75cdf9dd02f9e8c3c1ecaf44920075de"
  }, {
    "url": "pwa-512x512.png",
    "revision": "4ace419e3cd4c85428bbe311b9d80e4b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "21358ca04ceed620213285de5538779d"
  }, {
    "url": "index.html",
    "revision": "6726dbeff9164f5cd0127f2978c63af5"
  }, {
    "url": "icon.svg",
    "revision": "422524df79368659d734bec5664f8f2b"
  }, {
    "url": "icon-512.png",
    "revision": "4ace419e3cd4c85428bbe311b9d80e4b"
  }, {
    "url": "icon-192.png",
    "revision": "21358ca04ceed620213285de5538779d"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "dc1e91c3fd047da3a3bd028aeab41f8e"
  }, {
    "url": "assets/index-BvLtw0HD.js",
    "revision": null
  }, {
    "url": "assets/index-2JM0i0z2.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "dc1e91c3fd047da3a3bd028aeab41f8e"
  }, {
    "url": "icon.svg",
    "revision": "422524df79368659d734bec5664f8f2b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "21358ca04ceed620213285de5538779d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "4ace419e3cd4c85428bbe311b9d80e4b"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "75cdf9dd02f9e8c3c1ecaf44920075de"
  }, {
    "url": "manifest.webmanifest",
    "revision": "4a7f6af685ff42d332a1f0ef134f695c"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
