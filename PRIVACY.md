# Privacy

Plain-English explanation of exactly what Keygarden does and doesn't do. Read the source if you'd rather verify it yourself — the whole app is one HTML file (`index.html`).

## What gets collected and sent to a server

**Nothing.**

Keygarden has no server, no backend, no accounts, no analytics, no telemetry, no usage tracking, no error reporting service. Once your browser has loaded the page, the app does not make any network calls. (The published version on GitHub Pages loads React from a public CDN on first visit; everything else stays on your device. The offline build inlines React and makes zero network calls at all.)

## What gets stored, and where

A single value in your own browser's **localStorage** under the key `keygarden.v1`. That value is a JSON blob holding:

- Your per-symbol practice stats (attempts, misses, recent latencies)
- Your art-pack and sensitivity settings
- Your sketch progress and finished-drawing collection
- Your return-streak counts
- Whether you've seen the welcome screen, and your voice/sound toggles

That's the entire data model. Open your browser's developer tools and inspect localStorage to see it. Clear your browser data, or use the **Reset progress & settings** button in the app's gear menu, to delete everything.

## What about my keystrokes?

Keygarden listens for `keydown` events **only while its own browser window is focused**. When you press a key:

1. The app's React code receives the character
2. It compares it to the current target
3. It updates the on-screen UI
4. It increments the relevant counter in localStorage (debounced)

The character is never written to a file on disk, never sent over the network, and is not retained as a string after it's been counted. The app does not install a keyboard hook, does not use any OS-level API, and cannot read keystrokes that happen in other windows or applications. It is a normal web page; the browser sandbox enforces this absolutely.

## Microphone, camera, files, clipboard

None of these are requested or accessed. Keygarden has zero permissions beyond what any plain HTML page has by default.

## Speech synthesis (the "voice coaching" toggle)

When you turn on the 🔊 button, the app uses the browser's built-in `speechSynthesis` API to read key names and miss hints out loud. This is the same browser feature any website can use; it does not access your microphone or send audio anywhere. Turn it off if you don't want it.

## Audio (the ♪ button)

Sound is **off by default**. When enabled, the app synthesizes its own audio in-browser from math (sine waves and gain nodes via the Web Audio API). No audio files are downloaded, recorded, or sent anywhere.

## When installed as an app (PWA)

If you click **Install** in your browser's address bar to add Keygarden as a Progressive Web App, the browser caches the page and its dependencies in a local cache (so the app works offline). The cached files are exactly the public files served from `https://michaelnocito.github.io/keygarden/`. No additional permissions are granted by installing.

## Auditing this for yourself

- **Read the source**: open `index.html` in any text editor. The entire app — every keystroke handler, every save call, every audio routine — is plainly readable.
- **Watch the network tab**: with browser dev tools open, you'll see the page load once (HTML + React from CDN + the icons) and then no further network requests during a session.
- **Inspect localStorage**: dev tools → Application → Storage → `keygarden.v1` shows the exact JSON being saved.

## Contact

Found a privacy concern, or want to suggest a clarification to this document? Open an issue at [github.com/michaelnocito/keygarden/issues](https://github.com/michaelnocito/keygarden/issues).
