# Test Report

Date: Sat Jun 28 20:08:47 UTC 2025

## Summary
- npm warning: unknown env config 'http-proxy'
- React Router future flag warnings (multiple occurrences)
- CSP Violation logs during server tests
- 3 failing test files, 4 failing tests total
- 1 unhandled error during test run

## Last 20 lines of output

```
 ❯ updateClassComponent node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:19727:24
 ❯ beginWork node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:21650:16
 ❯ beginWork$1 node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:27465:14
 ❯ performUnitOfWork node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:26599:12
 ❯ workLoopSync node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:26505:5
 ❯ renderRootSync node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:26473:7
 ❯ recoverFromConcurrentError node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/cjs/react-dom.development.js:25889:20

This error originated in "tests/App.test.tsx" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.
The latest test that might've caused the error is "renders home page". It might mean one of the following:
- The error was thrown, while Vitest was running this test.
- If the error occurred after the test had been completed, this was the last documented test before it was thrown.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 Test Files  3 failed | 29 passed (32)
      Tests  4 failed | 98 passed (102)
     Errors  1 error
   Start at  20:08:05
   Duration  15.97s (transform 751ms, setup 12.64s, collect 3.22s, tests 7.58s, environment 21.08s, prepare 4.84s)

```
