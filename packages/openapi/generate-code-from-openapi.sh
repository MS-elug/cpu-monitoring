#!/bin/sh

# Script to generate api-client from the openapi specification

openApiSrc="openapi/monitoring-api.yml"
openApiTemplate="typescript-axios"
openApiAdditionalProperties="npmName=@monitoring/api-client"
outDir="api-client"

read -p "Do you want to generate the source using docker (Y/n): " USE_DOCKER

cd ../

if [ -z "$USE_DOCKER" -o "$USE_DOCKER" = "Y" ]
then
    docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
        -i /local/$openApiSrc \
        -g $openApiTemplate \
        -o /local/$outDir \
        --additional-properties=$openApiAdditionalProperties

else
    if [ -n `which java` ]
    then
        echo Java not detected. Use Docker or install Java 7.
        exit 1
    fi
    npx @openapitools/openapi-generator-cli generate \
        -i ./$openApiSrc \
        -g $openApiTemplate \
        -o ./$outDir \
        --additional-properties=$openApiAdditionalProperties
fi
