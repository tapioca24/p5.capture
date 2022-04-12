# CONTRIBUTING

We welcome contributions from everyone!

## Getting started

Make sure you have Node.js and Yarn installed.

1. Fork this repository and clone your fork
2. Install dependencies: `yarn install`
3. Install browsers for E2E test: `yarn setup`

## Build

Run the build with the following command:

```sh
yarn build
```

## Running tests

Testing is a crucial part of any software project.
For all but the most trivial changes (typos, etc) test cases are expected.

### Unit test

This project uses [Vitest](https://vitest.dev/) for the unit test.  
Run the test with the following command:

- Run all test suites but watch for changes and rerun tests when they change: `yarn test:unit`
- Perform a single run without watch mode: `yarn test:unit run`

### E2E test

This project uses [Playwright](https://playwright.dev/) for the end-to-end test.  

- In all available and supported browsers: `yarn test:e2e`
- In a specific browser: `yarn test:e2e --project=chromium`, `yarn test:e2e --project=firefox`, etc.

You can use `yarn test:e2e:skipbuild` to skip the build if you are sure it has already been built.
