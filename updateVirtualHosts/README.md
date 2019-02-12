# Node.JS script to list and update virtual hosts in proxies

This directory contains a Node.js program that allows an Org Admin to update the
virtual host names used on existing proxies. It uses Edge Management API calls to update the proxy in real time, that is without requiring a re-deployment.

NOTE: Familiarize yourself with the tool by running the script on a small set of proxies.

The program

## Disclaimer

This example is not an official Google product, nor is it part of an official Google product.

## Example 1: List all proxies and their virtual host names

```
node updateVirtualHosts-v2.js list -n -o YOUR_ORG_NAME

... truncated output ...
CURRENT PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=loggly     VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=default    VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=default    VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=loggly     VHOSTS=default,secure
... truncated output ...
```

## Example 2: Filter the list of the proxies and environments
```
$ node updateVirtualHosts-v2.js list -n -o YOUR_ORG_NAME -e test,prod -p currency-v1,currency-jenkinsv1

CURRENT PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=loggly     VHOSTS=secure
CURRENT PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=loggly     VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=default    VHOSTS=default,secure
CURRENT PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=default    VHOSTS=secure
CURRENT PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=loggly     VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=default    VHOSTS=default,secure
```

## Example 3: Add the https_one_way virtual host for the identified proxies and environments
```
$ node updateVirtualHosts-v2.js add default -n -o YOUR_ORG_NAME -e test -p currency-jenkinsv1

CURRENT PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=loggly     VHOSTS=secure
CURRENT PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=default    VHOSTS=secure
UPDATED PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=loggly     VHOSTS=secure,default
UPDATED PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=default    VHOSTS=secure,default
```

## Example 4: Set the virtual hosts for identified proxies and environments
```
$ node updateVirtualHosts-v2.js set default,secure -n -o YOUR_ORG_NAME -e test,prod -p currency-v1,currency-jenkinsv1

CURRENT PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=loggly     VHOSTS=secure,default
CURRENT PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=default    VHOSTS=secure,default
CURRENT PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=loggly     VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=loggly     VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=default    VHOSTS=default,secure
CURRENT PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=default    VHOSTS=default,secure

UPDATED PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=loggly     VHOSTS=default,secure
UPDATED PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=loggly     VHOSTS=default,secure
UPDATED PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=default    VHOSTS=default,secure
UPDATED PROXY=currency-jenkinsv1------------------------------ REV=15 ENV=test-------- ENDPOINT=loggly     VHOSTS=default,secure
UPDATED PROXY=currency-v1------------------------------------- REV=84 ENV=prod-------- ENDPOINT=default    VHOSTS=default,secure
UPDATED PROXY=currency-v1------------------------------------- REV=82 ENV=test-------- ENDPOINT=default    VHOSTS=default,secure
```
