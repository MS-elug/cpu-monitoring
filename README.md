# Monitoring CPU

This application is a proof-of-concept (POC) for a browser-based CPU load monitoring application.

With this application, you have a real-time monitoring of your local CPU Average load.

When CPU is under high average load for more than 2 minutes or when the CPU comes back to normal (recovered state), visual and sound alerts are raised to inform the user.

Alerts activation is managed by the user.

Product requirements:

- Minimal resolution:
- Recommended resolution:
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

Have Yarn 2.0 installed

Have NodeJS 14

## Start the application

First you must make sure to have executed the following commands in order at least once in order to prepare the project.
```sh
yarn install
yarn build
```

To start the app for a developer environement (with automatic watch of the files and reload on change), run the command `yarn start:dev`

To start the app for a 'production-like' environement, run `yarn start:dev`

## Notes

The monitoring is made to be compatible with a TV display (so no scrolling)

TO support: When backend is down, shows 0 CPU in average and trigger alerts

On reload; call the method 'dump' of the graph to store the date, then load to restore

For performances, add memoize methods for valued redux selectors (like the sorted selctor)

There is a warning "findDOMNode is deprecated in StrictMode" coming from the use of Snackbar component, however the issue is known and will be fixed by the community soon in v5 [#13394](https://github.com/mui-org/material-ui/issues/13394).

In dev mode, you can simulate by running the following codebase in the browser console: `window.heavy= !!!window.heavy; window.simulateAlert(window.heavy, 21*1000);`
