/* jshint node: true  */
'use strict';
/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
	Author: Kurt Kanaskie - kurtkanaskie@google.com
	Revision: 1.0
	Date: 2019-02-12
	Disclaimer: "This is not an officially supported Google product."
	Install: npm install
	Usage: node listDeployments-v1.js
	List all  ------------------------------------------------------- node listDeployments-v1.js list -n -o ORG -a
	List un-deployments  -------------------------------------------- node listDeployments-v1.js list -n -o ORG -u
	List deployments  ----------------------------------------------- node listDeployments-v1.js list -n -o ORG -d
	List deployments with server details  --------------------------- node listDeployments-v1.js list -n -o ORG -d -s
	List all for proxy example-v1 ----------------------------------- node listDeployments-v1.js list -n -o ORG -a -p example-v1
	List all for env test ------------------------------------------- node listDeployments-v1.js list -n -o ORG -e test -a 
	List all for env prod, proxy example-v1 ------------------------- node listDeployments-v1.js list -n -o ORG -e prod -a -p example-v1
	List all for envs test,prod, proxies example-v1,example-mock-v1 - node listDeployments-v1.js list -n -o ORG -e test,prod -p example-v1,example-mock-v1
*/
/*  Functional overview
	GET {{MGMTSVR}}/v1/o/{{ORG}}/apis
	For each API name

		GET {{MGMTSVR}}/v1/o/{{ORG}}/apis/{{PROXYNAME}}/deployments
		For each deployment
			For each env
				For each revision
					Output message for the proxy
						Outpout messages for the servers and status
*/

var request = require('request');
var netrc = require('netrc')();
var url = require('url');
var program = require('commander');
var padChar = ' ';

var COMMAND, BASICAUTH, MGMTSVR, ORG, ENVS = [], PROXIES = [], VHOSTS = [];

program.version('1.0', '-v, --version')
	.usage( '[list] -n -o <org> [options]')
	.option('-n, --netrc', 'Use credentials in $HOME/.netrc (required)')
	.option('-b, --baseuri <baseuri>', 'Management server base URI', 'https://api.enterprise.apigee.com')
	.option('-o, --org <org>', 'Organization name (required)')
	.option('-e, --envs <envs>', 'Filter the comma separated list of environments')
	.option('-p, --proxies <proxies>', 'Filter the comma separated list of proxies')
	.option('-u, --undeployed', 'List undeployed only')
	.option('-d, --deployed', 'List deployed only')
	.option('-a, --all', 'List all deployments regardless of status (default)')
	.option('-s, --serverDetails', 'List deployments details for deployed proxies');

	program.command('list')
		.description('List out the existing virtualHosts')
		.action( function() {
			COMMAND = 'list';
		});

	program.parse(process.argv);

	if( program.undeployed !== true && program.deployed !== true ) {
		program.all = true;
	}

if (!process.argv.slice(2).length) {
	program.outputHelp();
	process.exit(1);
}

if( COMMAND === undefined ) {
	console.log( 'A command is required (list)' );
	program.outputHelp();
	process.exit(1);
}

if( program.org === undefined ) {
	console.log( 'Required option "-o <org>" is missing' );
	program.outputHelp();
	process.exit(1);
}
ORG = program.org;

MGMTSVR = program.baseuri + '/v1/o/';
if( program.netrc === true ) {
	var mgmtUrl = url.parse(program.baseuri);
	if( netrc[mgmtUrl.host] ) {
		var username = netrc[mgmtUrl.host].login;
		var password = netrc[mgmtUrl.host].password;
		BASICAUTH = Buffer.from(username + ":" + password).toString('base64');
	} else {
		console.log( "No matching credentials for baseuri %s and host %s in .netrc", program.baseuri, mgmtUrl.host);
		console.log( "mgmtUrl %s", JSON.stringify(mgmtUrl));
		process.exit(1);
	}
} else {
	console.log( "Currently .netrc must be used for credentials" );
	process.exit(1);
}

ENVS = program.envs !== undefined ? program.envs.split(',') : undefined;
PROXIES = program.proxies !== undefined ? program.proxies.split(',') : undefined;
// console.log( 'MGMTSVR=%s COMMAND=%s ORG=%s ENVS=%s PROXIES=%s VHOSTS=%s', MGMTSVR, COMMAND, ORG, ENVS, PROXIES, VHOSTS);

// Kick it off

getAPINames( getAPINamesResponse );

function getAPINames( callback ) {
	// console.log( "%s %s %s %s", 'PROXY'.padEnd(48,padChar), 'REV'.padEnd(6,padChar), 'ENV'.padEnd(16,padChar), 'STATE');
	var localRequest = {
	  url: MGMTSVR + ORG + '/apis/',
	  headers: { 'Authorization': 'Basic ' + BASICAUTH },
		  method: 'GET',
		  json: true
	};

	// console.log( "GET APIs: " + localRequest.url );
	request(localRequest, function ( error, response, body ) {
		if (!error && response.statusCode == 200) {
			callback( body );
		} else {
			throw "ERROR: " + error + "\nRESPONSE: " + JSON.stringify(response);
		}
	});
}
function getAPINamesResponse( apiNames ) {
	// console.log( "APIS: " + apiNames );
	for( var a=0; a<apiNames.length; a++ ) {
		// Show all APIs if undefined or filter API names
		// console.log( "API: " + apiNames[a] );
		if( PROXIES === undefined || (PROXIES !== undefined && PROXIES.includes(apiNames[a]) ) ) {
			getDeployments( apiNames[a], getDeploymentsResponse );
		}
	}
}

function getDeployments( proxyName, callback ) {
	var localRequest = {
	  url: MGMTSVR + ORG + '/apis/' + proxyName + '/deployments',
	  headers: { 'Authorization': 'Basic ' + BASICAUTH },
		  method: 'GET',
		  json: true
	};

	// console.log( "GET DEPLOYMENTS: " + localRequest.url );
	request(localRequest, function ( error, response, body ) {
		if (!error && response.statusCode == 200) {
			callback( body );
		} else {
			throw "ERROR: " + error + "\nRESPONSE: " + JSON.stringify(response);
		}
	});
}
function getDeploymentsResponse( deployments ) {
	// console.log( "DEP: " + JSON.stringify(deployments));
	var envs = deployments.environment;
	var deployed = false;
	for( var e=0; e<envs.length; e++ ) {
		// Show all environments or filter environments
		if( ENVS === undefined || (ENVS !== undefined && ENVS.includes( envs[e].name) ) ) {
			deployed = true;
			for( var r=0; r<envs[e].revision.length; r++ ) {
				if( (program.all === true) || (program.deployed === true) ) {
					console.log( "%s REV=%s ENV=%s STATE=%s",
						deployments.name.padEnd(48,padChar),
						envs[e].revision[r].name.padEnd(2),
						envs[e].name.padEnd(12,padChar),
						envs[e].revision[r].state );
					if( program.serverDetails === true || envs[e].revision[r].state !== 'deployed') {
						for( var s=0; s<envs[e].revision[r].server.length; s++ ) {
						console.log( "     SERVER=%s POD=%s REG=%s TYPE=%s STATUS=%s",
							envs[e].revision[r].server[s].uUID,
							envs[e].revision[r].server[s].pod !== undefined ? envs[e].revision[r].server[s].pod.name.padEnd(12) : 'NA',
							envs[e].revision[r].server[s].pod !== undefined ? envs[e].revision[r].server[s].pod.region.padEnd(14) : 'NA',
							envs[e].revision[r].server[s].type.toString().padEnd(17,padChar),
							envs[e].revision[r].server[s].status );
						}
					}
				}
			}
		}
	}
	if( ((program.all === true) || (program.undeployed === true)) && deployed === false ) {
		console.log( "%s STATE=undeployed", deployments.name.padEnd(72, padChar));
	}
}
