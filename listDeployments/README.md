# Node.JS script to list API proxy deployment details

This directory contains a Node.js program that allows an Org Admin to view deployment details for proxies. It is useful for detecting improperly deployed proxies or to see what proxies are not deployed. It uses standard Edge Management API calls.

NOTE: Familiarize yourself with the tool by running the script on a small set of proxies.

NOTE: By default the program will only list improperly deployed proxies, so it may not appear to work. To see all details use the `-v --verbose` option.

## Example 1: List all proxies and their virtual host names

```
$ node listDeployments-v1.js list -n -v -o YOUR_ORG_NAME

... truncated output ...
PROXY=cat-identity-v1-attribute======================= is not deployed
PROXY=Products-Stackdriver============================ is not deployed
PROXY=Demo-Catalog==================================== is not deployed
... truncated output ...
PROXY=stackdriver-2----------------------------------- REV=2  ENV=test-------- STATE=deployed
     SERVER=aa3d76cf-e542-40a5-8d99-c5904b7de901 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=b63e4495-d174-45c1-b804-7104e0cb3916 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=2de83908-f624-4b7b-b4d8-9106c9f90e2e POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=4c1dfcaa-f684-4737-bc71-48a838a499e2 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=0376a4b8-df3f-4557-ae72-cc67f3859590 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=ba83c6f9-7d82-4f22-8967-f66568d2fb33 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8b17d613-c35c-42a1-b80d-e106a8a7d56e POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8c27c616-6d63-4030-acda-026e05e6f68d POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
PROXY=demo-oauth-v1-attribute========================= is not deployed
PROXY=oidc-v1-azure=================================== is not deployed
PROXY=oauth-demo-v1-attribute========================= is not deployed
PROXY=prepaid-addons-jira1v1-------------------------- REV=1  ENV=test-------- STATE=deployed
     SERVER=aa3d76cf-e542-40a5-8d99-c5904b7de901 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=b63e4495-d174-45c1-b804-7104e0cb3916 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=2de83908-f624-4b7b-b4d8-9106c9f90e2e POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=4c1dfcaa-f684-4737-bc71-48a838a499e2 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=0376a4b8-df3f-4557-ae72-cc67f3859590 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=ba83c6f9-7d82-4f22-8967-f66568d2fb33 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8b17d613-c35c-42a1-b80d-e106a8a7d56e POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8c27c616-6d63-4030-acda-026e05e6f68d POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
PROXY=pingstatus-mockswagger-v1======================= is not deployed
PROXY=pingstatus-v1-oas------------------------------- REV=1  ENV=test-------- STATE=deployed
     SERVER=aa3d76cf-e542-40a5-8d99-c5904b7de901 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=b63e4495-d174-45c1-b804-7104e0cb3916 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=2de83908-f624-4b7b-b4d8-9106c9f90e2e POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=4c1dfcaa-f684-4737-bc71-48a838a499e2 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=0376a4b8-df3f-4557-ae72-cc67f3859590 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=ba83c6f9-7d82-4f22-8967-f66568d2fb33 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8b17d613-c35c-42a1-b80d-e106a8a7d56e POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8c27c616-6d63-4030-acda-026e05e6f68d POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     ... truncated output ...
```

## Example 2: Filter the list of the proxies and environments
```
$ node listDeployments/listDeployments-v1.js list -n -v -o YOUR_ORG_NAME -e test  -p pingstatus-v1,pingstatus-tls-v1
PROXY=pingstatus-tls-v1------------------------------- REV=9  ENV=test-------- STATE=deployed
     SERVER=aa3d76cf-e542-40a5-8d99-c5904b7de901 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=b63e4495-d174-45c1-b804-7104e0cb3916 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=2de83908-f624-4b7b-b4d8-9106c9f90e2e POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=4c1dfcaa-f684-4737-bc71-48a838a499e2 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=0376a4b8-df3f-4557-ae72-cc67f3859590 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=ba83c6f9-7d82-4f22-8967-f66568d2fb33 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8b17d613-c35c-42a1-b80d-e106a8a7d56e POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8c27c616-6d63-4030-acda-026e05e6f68d POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
PROXY=pingstatus-v1----------------------------------- REV=67 ENV=test-------- STATE=deployed
     SERVER=aa3d76cf-e542-40a5-8d99-c5904b7de901 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=b63e4495-d174-45c1-b804-7104e0cb3916 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=2de83908-f624-4b7b-b4d8-9106c9f90e2e POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=4c1dfcaa-f684-4737-bc71-48a838a499e2 POD=rgce1mp001-4 REG=us-central1 TYPE=message-processor STATUS=deployed
     SERVER=0376a4b8-df3f-4557-ae72-cc67f3859590 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=ba83c6f9-7d82-4f22-8967-f66568d2fb33 POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8b17d613-c35c-42a1-b80d-e106a8a7d56e POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
     SERVER=8c27c616-6d63-4030-acda-026e05e6f68d POD=rgce1rt001-1 REG=us-central1 TYPE=router----------- STATUS=deployed
```
