/*
* @Author: gbk
* @Date:   2016-06-26 10:38:07
* @Last Modified by:   gbk
* @Last Modified time: 2017-03-20 10:51:44
*/

'use strict';

var os = require('os');
var path = require('path');
var exec = require('child_process').execSync;

var configRoot = path.join(os.homedir(), '.wiwi');
var rimrafPath = path.join(configRoot, 'install', '.bin', 'rimraf');
var installMods = path.join(configRoot, 'install', '*');
console.log('rimrafPath', rimrafPath);
console.log('installMods', installMods);
exec('node ' + rimrafPath + ' ../nowa-* ' + installMods);
