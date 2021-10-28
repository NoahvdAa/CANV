# CANV

[Live demo](https://canv.pages.dev/)

CANV is a "community canvas", created for the [Cloudflare Summer Challenge](https://challenge.developers.cloudflare.com). The frontend is hosted on [Cloudflare Pages](https://developers.cloudflare.com/pages/). The backend is hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/), using [Cloudflare Workers KV](https://developers.cloudflare.com/workers/learning/how-kv-works) for storage. CANV is inspired by [r/place](https://en.wikipedia.org/wiki/Place_(Reddit)) and [pxls.space](https://pxls.space).

## Backend

The backend is relatively simple. It consists of a single worker, with only four routes, out of which two are actually used in the frontend. The canvas is stored in a single KV key, containing an array with 10,000 elements. These elements are arrays with two items, the color and the last time the pixel was changed (or `null` if the pixel is still the default).

## Frontend

The frontend is not as polished as I'd like it to be. Because I started this project very close to the deadline, I unfortunately didn't have the time to add some features I would have liked, such as zooming and (better) mobile support. Regardless, I think the frontend does what it's supposed to do. Upon page load, the frontend will request the entire canvas, and draw it. After that, every 15 seconds (or when the page is unloaded), all newly placed pixels will be saved in a single batch (if there are any), and the newest version of the canvas will be loaded. The changes are combined together in a batch save, to prevent quickly running into KV daily write limits.