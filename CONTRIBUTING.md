# Contributing

1. Use Node.js 22 or newer.
2. Run `npm install`.
3. Create a focused branch and include tests for behavior changes.
4. Run `npm run check` and `npm pack --dry-run` before opening a pull request.

Host changes require restarting DSH. Client changes can be rebuilt with `npm run watch:client` and remounted by the active DSH client-HMR chain.
