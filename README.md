This example doesn't work. See the issue: https://github.com/Birch-san/box2d-wasm/issues/58

The same example in box2d-core and Pixi.js that works: https://github.com/8Observer8/ray-casting-box2dcore-pixijs-js

Sandboxes:
- [PlayCode](https://playcode.io/1524226)
- [Plunker](https://plnkr.co/edit/KuyR73HafXcmVVsP?preview)

Install globally:

> npm i -g http-server rollup uglify-js

Run http-server. Add `-c-1` as an option to disable caching:

> http-server -c-1

Debug mode:

> npm run dev

Release build. Stop debugging (Ctrl+C in CMD). Type:

> npm run release
