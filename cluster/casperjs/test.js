/**
 * Created by porter haet 10/26/16.
 * 695Q-FSOObdXAzqA191RHGiwetaAHSQ0PyYF4CKdoH8
 */

var fs = require('fs');
var casper = require('casper').create({verbose: true,  logLevel: 'debug'});
//var system = require('system');
//var mechanics_central =  require('../config/credentials/mechanics_central');

fs.write(casper.cli.args[0] + ".qfx", "hi");

casper.run();
