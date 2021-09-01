# Monitoring CPU

This application is a proof-of-concept (POC) for a browser-based CPU load monitoring application.

With this application, you have a real-time monitoring of your local CPU Average load.

When CPU is under high average load for more than 2 minutes or when the CPU comes back to normal (recovered state), visual and sound alerts are raised to inform the user.

Alerts activation is managed by the user.

<p align="center">
  <img width="700" align="center" src="./docs/demo.gif" alt="demo"/>
</p>

Product requirements:

- Minimal resolution:
- Recommended resolution: > 1024px Width & >1180px height
- Browser support: Last N-1 and N versions for Chrome, Edge, Firefox and Safari
- OS Support: Windows, Linux, MacOS

Learn more about CPU load here on [Wikipedia](https://en.wikipedia.org/wiki/Load_%28computing%29)

## Architecture

Project structure:

```text
.
├── apps
│   ├── backend
│   └── frontend
└── packages
    ├── api-client
    └── openapi
```

The application is splitted in 2 apps and 2 packages:

- A [Backend](./apps/backend) in NodeJs & Typescript: in charge to collect the CPU information on the node it is running and deploy HTTP REST API to make this information public
- A [Frontend](./apps/frontend) written with React + Redux & Typescript, the browser based application in charge to regularly collect the CPU information from the local Backend node and display this information to user
- A REST API interface, documented was an [OpenApi specification](./packages/openapi/monitoring-api.yml)
- An Axios & Typescript [Client API project](./packages/api-client) generated using an OpenApi code generator from the OpenApi specification. This project generates Typescript interfaces and client api for both the backend and frontend.

## Prerequisites

In order to run this application, please make sure your environment is setup with:

- [NodeJS 14](https://nodejs.org/en/)
- [Yarn 2.0](https://yarnpkg.com/getting-started/install)

## Installation

First you must make sure to have executed the following commands in order at least once in order to prepare the project.

```sh
yarn install
yarn build
```

## Usage

To start the app for a developer environement (with automatic watch of the files and reload on change)

```sh
yarn start:dev
```

To start the app for a 'production-like' environement

```sh
yarn start
```

PS: In dev mode, you can simulate an alert by executing the following script in the browser console: `window.heavy= !!!window.heavy; window.simulateAlert(window.heavy, 21*1000);`

## Test

```sh
yarn test
```

## Roadmap for Production

This PoC is not fully qualified to be run in a production environement yet. Here is a list of items to review/implement:

- Performance-MemoryLeaks: If this application is intended to monitor a CPU average continuously (24/24h) then both the backend and frontend have to tested about memory leaks on a long period. It might also be a good to implement an automatic and regular restart of backend with sh script, and automatical reload of the frontend page (To be noted, today the frontend doesn't retain the previous data after a refresh, this would be required for this implementation).
- Performance-Stability: A process watcher should be put in place to make sure the backend automatically restart after a crash.
- Design: Review of the PoC design should be done with a UX team
- Stability: Fix all the known bugs (ref section below)
- Test: Coverage is not satisfying yet, for a production release it's recommended to improve the coverage rate.
- Test: E2E testing scenarios are missing and should be implemented, there is only unit testing of components.

## Known bugs

- Bugs: When the first alert is shown to user, there is a warning "findDOMNode is deprecated in StrictMode" coming from the use of Snackbar component, however the issue is known and will be fixed by the community soon in material-ui v5 [#13394](https://github.com/mui-org/material-ui/issues/13394). A library update should be done before a load in production, despite the current warning is not a blocker.

## LICENSE

[MIT](./LICENSE.md)
