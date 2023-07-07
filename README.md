WASM UI-component experiment
-------------------------

Experimenting with a Svelte/React-like UI framework that uses WASM.

## Reasons

- The same code could be rendered client-side and server-side, since both browser and node.js support `WebAssembly.instantiate()`
- The components could be run from non-node.js runtimes, like Ruby, Python, Rust etc..
- Could eliminate cold-starts in cloud.
- Would allow embedding Svelte components as plugins.
- It would allow resumable components (by copying the assembly's state from the server to the client)

## How it works

- I hand-coded an assembly in Wasm Text Format (wat). See `example.wat`.
- It has functions for `mount`, `attach`, `detach` and `update`. Similar to a Svelte or React component.
- It expects an imported library for accessing the DOM. ie `createElement`, `appendChild`, etc..
- It renders server-side using `jsdom`, see `exec.js`
- It renders in the browser, using the HTML provided in `server.js`

## Usage

- `pnpm build`: build `example.wat` into `example.wasm`.
- `pnpm dev:server`: run component server-side using `jsdom`.
- `pnpm dev:client`: visit `http://localhost:3000` to render component in-browser.

## Learnings & unknowns

- Would it require a large runtime to be embedded within the wasm assembly? For example dotnet blazor needs to embed the .net runtime. Though the .net runtime is larger that what needed for simple DOM manipulation.
- How to link components together? Maybe that's a build step
- How does reactivity, if, each work (should be doable, just haven't tried it)
- Is resumability possible? [I think so](https://github.com/joshnuss/wasm-resumability-experiment)
