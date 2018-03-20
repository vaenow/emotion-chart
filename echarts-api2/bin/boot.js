/**
 * Created by luowen on 2018/1/10.
 */
var fs = require('fs');
var babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelConfig);
require('babel-polyfill');
require('./www');