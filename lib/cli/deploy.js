var spawn = require('child_process').spawn;

var fs = require('fs');
var conf = JSON.parse(fs.readFileSync('./res/config.json'), 'utf8');

var deploy = function(){
	var user = conf.deploy_user; 
	var host = conf.deploy_host;
	var dir = conf.deploy_dir;
	var src = './public/';
	var port = conf.deploy_port;
	console.log(conf.deploy_host);
	var rsync = spawn('rsync', [ '-avz', '-e', 'ssh -p 59184', '--delete', src , user+'@'+host+':'+dir ], {env: process.env, stdio: 'inherit'});
};

module.exports = deploy;