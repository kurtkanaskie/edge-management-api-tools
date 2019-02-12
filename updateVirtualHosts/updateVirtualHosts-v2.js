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
	Revision: 2.0
	Date: 2019-02-11
	Disclaimer: "This is not an officially supported Google product."
	Install: npm install
	Usage: node updateVirtualHosts-v2.js
	List all virtual hosts ------------------------------------------ node updateVirtualHosts-v2.js list -n -o ORG
	List all for env test ------------------------------------------- node updateVirtualHosts-v2.js list -n -o ORG -e test
	List all for proxy example-v1 ----------------------------------- node updateVirtualHosts-v2.js list -n -o ORG -p example-v1
	List all for env prod, proxy example-v1 ------------------------- node updateVirtualHosts-v2.js list -n -o ORG -e prod -p example-v1
	List all for envs test,prod, proxies example-v1,example-mock-v1 - node updateVirtualHosts-v2.js list -n -o ORG -e test,prod -p example-v1,example-mock-v1
	Add https_one_way in test for proxy example-v1 ------------------ node updateVirtualHosts-v2.js add https_one_way -o ORG -e test -p example-v1
	Set default,secure in test for proxy example-v------------------- node updateVirtualHosts-v2.js set default,secure -o ORG -e test -p example-v1
*/
/*  Functional overview
	GET {{MGMTSVR}}/v1/o/{{ORG}}/apis
	For each API name

		GET {{MGMTSVR}}/v1/o/{{ORG}}/apis/{{PROXYNAME}}/deployments
		For each deployment
			For each env
				For each revision

					GET {{MGMTSVR}}/v1/o/{{ORG}}/apis/{{PROXYNAME}}/revisions/{{REVISION}}/proxies
					For each proxy endpoint

						proxyEndpoint = GET {{MGMTSVR}}/v1/o/{{ORG}}/apis/{{PROXYNAME}}/revisions/{{REVISION}}/proxies/{{PROXYENDPOINT}}

						SET proxyEndpoint.connection.virtualHost = [ "default", "secure" ];
							or
						ADD proxyEndpoint.connection.virtualHost.push("https_one_way")

						Update proxy endpoint
						PUT {{MGMTSVR}}/v1/o/{{ORG}}/apis/{{PROXYNAME}}/revisions/{{REVISION}}/proxies/{{PROXYENDPOINT}} { proxyEndpint }
*/

var request = require('request');
var netrc = require('netrc')();
var url = require('url');
var program = require('commander');

var COMMAND, BASICAUTH, MGMTSVR, ORG, ENVS = [], PROXIES = [], VHOSTS = [];

program.version('2.0', '-v, --version')
	.usage( '[list,add,set] -n -o <org> [options]')
	.option('-n, --netrc', 'Use credentials in $HOME/.netrc (required)')
	.option('-b, --baseuri <baseuri>', 'Management server base URI', 'https://api.enterprise.apigee.com')
	.option('-o, --org <org>', 'Organization name (required)')
	.option('-e, --envs <envs>', 'Filter the comma separated list of environments')
	.option('-p, --proxies <proxies>', 'Filter the comma separated list of proxies');

	program.command('list')
		.description('List out the existing virtualHosts')
		.action( function() {
			COMMAND = 'list';
		});

	program.command('add <vhosts>')
		.description('Add the comma separated virtual host(s) to existing virtual hosts')
		.action( function(vh) {
			COMMAND = 'add';
			VHOSTS = vh.split(',');
		});

	program.command('set <vhosts>')
		.description('Set the comma separated virtual host(s) overriding existing values')
		.action( function(vh) {
			COMMAND = 'set';
			VHOSTS = vh.split(',');
		});

	program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.outputHelp();
	process.exit(1);
}

if( COMMAND === undefined ) {
	console.log( 'A command is required (list, add, set)' );
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
		console.log( "No matching credentials for %s in .netrc", program.baseuri);
		process.exit(1);
	}
} else {
	console.log( "Currently .netrc must be used for credentials" );
	process.exit(1);
}

ENVS = program.envs !== undefined ? program.envs.split(',') : undefined;
PROXIES = program.proxies !== undefined ? program.proxies.split(',') : undefined;
console.log( 'MGMTSVR=%s COMMAND=%s ORG=%s ENVS=%s PROXIES=%s VHOSTS=%s', MGMTSVR, COMMAND, ORG, ENVS, PROXIES, VHOSTS);

// Kick it off

if( ENVS === undefined || PROXIES === undefined ) {
	var readline = require('readline');
	var rl = readline.createInterface(process.stdin, process.stdout);
	if( ENVS === undefined ) {
		rl.setPrompt('You have not entered either environment or proxy values, do you want to do this for all? yes,[no] ');
		rl.prompt();
		rl.on('line', function(line) {
		    if (line !== "yes") {
				console.log( "Not all, OK " );
				process.exit(1);
			} else {
				getAPINames( getAPINamesResponse );
				rl.close();
			}
		});
	}
}

function getAPINames( callback ) {
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
	var envs = deployments.environment;
	for( var e=0; e<envs.length; e++ ) {
		// Show all environments or filter environments
		if( ENVS === undefined || (ENVS !== undefined && ENVS.includes( envs[e].name) ) ) {
			for( var r=0; r<envs[e].revision.length; r++ ) {
				getProxyEndpoints( deployments.name, envs[e].name, envs[e].revision[r].name, getProxyEndpointsResponse);
			}
		}
	}
}

function getProxyEndpoints( proxyName, env, revision, callback ) {
	var localRequest = {
	  url: MGMTSVR + ORG + '/apis/' + proxyName + '/revisions/' + revision + '/proxies',
	  headers: { 'Authorization': 'Basic ' + BASICAUTH },
	  method: 'GET',
	  json: true
	};

	// console.log( "GET ENDPOINTS: " + localRequest.url );
	request(localRequest, function ( error, response, body ) {
		if (!error && response.statusCode == 200) {
			callback( body, proxyName, env, revision );
		} else {
			throw "ERROR: " + error + "\nRESPONSE: " + JSON.stringify(response);
		}
	});
}
function getProxyEndpointsResponse( proxyEndpoints, proxyName, env, revision ) {
	for( var p=0; p<proxyEndpoints.length; p++ ) {
		getProxyEndpoint( proxyName, env, revision, proxyEndpoints[p], getProxyEndpointResponse )
	}
}

function getProxyEndpoint( proxyName, env, revision, endpointName, callback ) {
	var localRequest = {
	  url: MGMTSVR + ORG + '/apis/' + proxyName + '/revisions/' + revision + '/proxies/' + endpointName,
	  headers: { 'Authorization': 'Basic ' + BASICAUTH },
	  method: 'GET',
	  json: true
	};

	// console.log( "GET ENDPOINT: " + localRequest.url );
	request(localRequest, function ( error, response, body ) {
		if (!error && response.statusCode == 200) {
			callback(body, proxyName, env, revision);
		} else {
			throw "ERROR: " + error + "\nRESPONSE: " + JSON.stringify(response);
		}
	});
}
function getProxyEndpointResponse( proxyEndpoint, proxyName, env, revision ) {
	console.log( "CURRENT PROXY=%s REV=%s ENV=%s ENDPOINT=%s VHOSTS=%s", proxyName.padEnd(48,'-'), revision.padEnd(2), env.padEnd(12,'-'), proxyEndpoint.name.padEnd(10), proxyEndpoint.connection.virtualHost );

	if( COMMAND === 'add' || COMMAND === 'set') {
		if( COMMAND === 'add' ) {
			// console.log ( "ADDING: " + VHOSTS );
			for( var v=0; v<VHOSTS.length; v++) {
				proxyEndpoint.connection.virtualHost.push(VHOSTS[v]);
			}
		} else if( COMMAND === 'set' ) {
			// console.log ( "SETTING: " + VHOSTS );
			proxyEndpoint.connection.virtualHost = VHOSTS;
		}
		putProxyEndpoint( proxyName, env, revision, proxyEndpoint.name, proxyEndpoint, putProxyEndpointResponse );
	}
}

function putProxyEndpoint( proxyName, env, revision, endpointName, body, callback ) {
	var localRequest = {
	  url: MGMTSVR + ORG + '/apis/' + proxyName + '/revisions/' + revision + '/proxies/' + endpointName,
	  headers: { 'Authorization': 'Basic ' + BASICAUTH },
	  method: 'PUT',
	  json: true,
	  body: body
	};

	// console.log( "PUT ENDPOINT: " + localRequest.url );
	request(localRequest, function ( error, response, body ) {
		if (!error && response.statusCode == 200) {
			// console.log( "RESP: " + JSON.stringify(response) + "\nBODY: " + JSON.stringify(body));
			callback(body, proxyName, env, revision);
		} else {
			throw "ERROR: " + error + "\nRESPONSE: " + JSON.stringify(response);
		}
	});
}
function putProxyEndpointResponse( proxyEndpoint, proxyName, env, revision ) {
	console.log( "UPDATED PROXY=%s REV=%s ENV=%s ENDPOINT=%s VHOSTS=%s", proxyName.padEnd(48,'-'), revision.padEnd(2), env.padEnd(12,'-'), proxyEndpoint.name.padEnd(10), proxyEndpoint.connection.virtualHost );
}
