# Monitoring CPU

## Prerequisites

Have Yarn 2.0 installed

Have NodeJS 14

## Install

## Run the app as in production

## Run the app as developer


## Notes

The monitoring is made to be compatible with a TV display (so no scrolling)

TO support: When backend is down, shows 0 CPU in average and trigger alerts 

On reload; call the method 'dump' of the graph to store the date, then load to restore

For performances, add memoize methods for valued redux selectors (like the sorted selctor)

There is a warning "findDOMNode is deprecated in StrictMode" coming from the use of Snackbar component, however the issue is known and will be fixed by the community soon in v5 [#13394](https://github.com/mui-org/material-ui/issues/13394).

In dev mode, you can simulate by running the following codebase in the browser console: `window.heavy= !!!window.heavy; window.simulateAlert(window.heavy, 21*1000);`