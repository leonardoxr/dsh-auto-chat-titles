# dsh-auto-chat-titles

Semantic, configurable chat titles for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

The plugin keeps DSH's durable session-title service and replaces only its built-in provider policy. It adds:

- semantic LLM titles instead of relying on the first-words fallback;
- a dedicated title-model selector in **Settings → Plugins**;
- **Regenerate title** in the conversation header;
- regeneration from recent human-message context;
- live title length, context, byte, token, and timeout settings;
- the existing DSH cancellation, normalization, persistence, provenance, pinning, and projection behavior.

## Requirements

- DeepSeek Harness 0.1.1-rc.2 or newer compatible 0.1.x prerelease
- Node.js 22+
- Web profile with the standard session-title, settings, commands, and client runtime bundles

## Install

Directly from GitHub:

```sh
dsh plugin --profile web add github:leonardoxr/dsh-auto-chat-titles
```

From npm after publication:

```sh
dsh plugin --profile web add dsh-auto-chat-titles
```

From a checkout while developing:

```sh
npm install
npm run check
dsh plugin --profile web add "C:/absolute/path/to/dsh-auto-chat-titles"
```

Restart the Web profile after host or bundle-patch changes, then refresh the existing DSH Web page. For browser-only development, run `npm run watch:client`; DSH client HMR can remount rebuilt bundles when the active Web runtime has its HMR chain enabled.

## How it composes

The bundled `cordis.patch.yml` disables only the base `session-title-llm` row and inserts this plugin. It intentionally leaves the core `session-title` service enabled. DSH supports one asynchronous title provider at a time, so enabling both provider rows is an error.

Automatic generation uses the first eligible human message. Clicking **Regenerate title** calls the same durable service explicitly and uses up to the configured number of recent human messages. Manual rename continues to pin the title; explicit regeneration deliberately unpins and replaces it.

## Settings

Open **Settings → Plugins → Automatic chat titles**.

- **Title model** — inherit the exact conversation route or choose any model advertised by the host catalog.
- **Title length** — target words for non-CJK languages.
- **Regeneration context** — number of recent human messages included in manual regeneration.
- **Advanced generation limits** — CJK length, framed input bytes, output tokens, and timeout.

The settings are stored in `$DSH_HOME/settings.yaml` under `auto-chat-titles` when the standard file settings provider is mounted.

## Commands

The UI action invokes `/regenerate-title`. It can also be entered directly in the composer. The button confirms command admission; the conversation activity reports the eventual generation result. Command lifecycle events remain in the session audit log, and the generated title is persisted as DSH's standard `session/title` event.

## Development

```sh
npm install
npm run typecheck
npm test
npm run build
node scripts/preflight.mjs
npm pack --dry-run
```

The host half compiles to `lib/`. The browser half compiles to the DSH lazy-CJS module in `client/client.js`.

## License

MIT
