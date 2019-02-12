# Node.JS programs to access and update proxy details

This directory contains multiple Node.js programs.

See the README in each respective directory for details on each program.
* /listDeployments/[README.md](./listDeployments/README.md) - lists proxy deployment details.
* /updateVirtualHosts/[README.md](./updateVirtualHosts/README.md) - lists and updates virtual hosts used by proxy.

## Disclaimer

This example is not an official Google product, nor is it part of an official Google product.


## Installing

1. Clone or download and unzip the repository.

2. Then run
```
npm install
```

3. Understand the commands and options
```
node listDeployments/listDeployments-v1.js
node updateVirtualHosts/updateVirtualHosts-v2.js
```

## Notes

Requires the use of ~/.netrc for username and password.

To use this program, you will need access to an Edge organization, of course.

## License

This material is Copyright 2017-2018, Google LLC. and is licensed under the [Apache 2.0 License](LICENSE).
This includes the Node.JS code in `listDeployments-v1.js` and `updateVirtualHosts-v2.js`.

## Support

This program is open-source software, and is not a supported part of Apigee Edge.
If you need assistance, you can try inquiring on [The Apigee Community Site](https://community.apigee.com).  
There is no service-level guarantee for responses to inquiries regarding this callout.

## Bugs

* The `add` command for `updateVirtualHosts-v2.js` is not idempotent, it will merely add additional entries even if they are duplicates.
* The program uses Edge Management API calls which may be limited by quota and rate.
