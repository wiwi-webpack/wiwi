'use strict';

var fs = require('fs');
var path = require('path');
var semver = require('semver');
var resolve = require('resolve');
var chalk = require('chalk');
var program = require('commander');
var pkg = require('../package.json');
var argvs = process.argv;
var command = argvs[2];


if (!semver.satisfies(process.version, pkg.engines.node)) {
    console.log(chalk.red.bold('Require nodejs version ' + pkg.engines.node + ', current ' + process.version));
    console.log('Download the latest nodejs here ' + chalk.green('https://nodejs.org/en/download/'));
    process.exit();
}

program
    .version(pkg.version)
    .usage('<command> [options]');

var moduleDirs = [
    path.join(__dirname, '..', 'node_modules'),
    path.join(__dirname, '..', '..')
];

process._moduleDirs = moduleDirs;

var pluginPath = findPluginPath(command);

if (pluginPath) {
    var pluginDef = require(pluginPath);
    var plugin = program.command(pluginDef.command || command);
    if (pluginDef.description) {
        plugin.description(pluginDef.description);
    }

    if (pluginDef.options) {
        pluginDef.options.forEach(function(optArgs) {
            plugin.option.apply(plugin, optArgs);
        });
    }

    if (pluginDef.action) {
        plugin.action(function(cmd, opts) {
          if (cmd instanceof program.Command) {
            opts = cmd;
            cmd = '';
          }
          opts = opts || {};
    
          // run plugin action
          if (cmd) {
            pluginDef.action.call(this, cmd, opts);
          } else {
            pluginDef.action.call(this, opts);
          }
        });
    }
}

program.parse(argvs);

if (!argvs.slice(2).length) {
    program.outputHelp();
}

function findPluginPath(command) {
    if (command && /^\w+$/.test(command)) {
        try {
            return resolve.sync('wiwi' + command, {
                paths: moduleDirs
            });
        } catch (e) {
            console.log('');
            console.log('  ' + chalk.green.bold(command) + ' command is not installed.');
            console.log('');
        }
    }
}



