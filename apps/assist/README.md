# Assist (Next.js App)

- App Router, TypeScript, ESM.
- Consumes @oursynth/core via workspace link.

Development

- npm install at repo root
- npm run dev from repo root, then open <http://localhost:3000>

Build notes

- The app transpiles @oursynth/core and aliases it to its dist in next.config.js.
- NodeNext imports must use .js specifiers for local files.
- Known: a late-stage prod build error is under investigation.
