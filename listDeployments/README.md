# Node.JS script to list API proxy deployment details

This directory contains a Node.js program that allows an Org Admin to view deployment details for proxies. It is useful for detecting improperly deployed proxies or to see what proxies are not deployed. It uses standard Edge Management API calls.

By default the program will list all proxies deployments status. To see server deployment details use -s

## Example 1: List all proxies and their deployment status

```
$ node listDeployments-v1.js list -n -v -o YOUR_ORG_NAME

... truncated output ...
oauth-mock-v1                                                            STATE=undeployed
Demo-Catalog                                                             STATE=undeployed
Products-Stackdriver                                                     STATE=undeployed
oauth-v1                                         REV=29 ENV=test         STATE=deployed
pingstatus-v1                                    REV=42 ENV=prod         STATE=deployed
pingstatus-v1                                    REV=80 ENV=test         STATE=deployed
pingstatus-v1-mock                               REV=1  ENV=prod         STATE=deployed
pingstatus-v1-mock                               REV=1  ENV=test         STATE=deployed
... truncated output ...
```

## Example 2: Filter the list of the proxies and environments
```
$ node listDeployments-v1.js list -n -o kurtkanaskietrainer-trial -e test -s -p pingstatus-v1,pingstatus-tls-v1
pingstatus-tls-v1                                REV=9  ENV=test         STATE=deployed
     SERVER=d2b98ab1-a154-4f69-821f-eb3aa4083c4d POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=3274f913-4987-4c60-a1e5-4a4f8ecce301 POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=1d4a0729-481f-4454-be64-bfa3f1eaa9fe POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=1e90d40b-dd98-4ed0-a4d7-b0e51042500e POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=b992a9b3-4b33-4b23-b687-42a9edabcc94 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
     SERVER=318e3b13-51c3-4109-bd2b-1e35a3a24109 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
     SERVER=b4431b23-bb34-40ad-8643-ef44b17c13a6 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
     SERVER=c35a6858-47cc-46d8-a7af-9f6e4dc1ef58 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
pingstatus-v1                                    REV=80 ENV=test         STATE=deployed
     SERVER=d2b98ab1-a154-4f69-821f-eb3aa4083c4d POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=3274f913-4987-4c60-a1e5-4a4f8ecce301 POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=1d4a0729-481f-4454-be64-bfa3f1eaa9fe POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=1e90d40b-dd98-4ed0-a4d7-b0e51042500e POD=rgce1mp001-4 REG=us-central1    TYPE=message-processor STATUS=deployed
     SERVER=b992a9b3-4b33-4b23-b687-42a9edabcc94 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
     SERVER=318e3b13-51c3-4109-bd2b-1e35a3a24109 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
     SERVER=b4431b23-bb34-40ad-8643-ef44b17c13a6 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
     SERVER=c35a6858-47cc-46d8-a7af-9f6e4dc1ef58 POD=rgce1rt001-1 REG=us-central1    TYPE=router            STATUS=deployed
```
