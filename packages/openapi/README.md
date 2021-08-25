# OPENAPI

This package contains the Monitoring's OpenApi v3 specification: [monitoring-api.yml](.monitoring-api.yml)

## How to update

The easiest way is to upload [monitoring-api.yml](.monitoring-api.yml) to https://editor.swagger.io/, modify and validate the specification updates.

Updating [monitoring-api.yml](.monitoring-api.yml) doesn't have any impact, to process the change you must generate a new 'api-client' codebase.

Run the script `generate-code-from-openapi.sh` to generate a new version of the api-client