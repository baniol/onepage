var deploy = function(){

	var spawn = require('child_process').spawn,
		compile = require('./compile'),
		fs = require('fs'),
		conf = JSON.parse(fs.readFileSync('./res/config.json'), 'utf8');

	var user = conf.deploy_user,
		host = conf.deploy_host,
		dir = conf.deploy_dir,
		src = './public/',
		port = conf.deploy_port;

	compile.compileAll(undefined,function(){
		console.log('Sending files to : '+user+'@'+conf.deploy_host+' : '+dir);
		var rsync = spawn('rsync', [ '-avz', '-e', 'ssh -p 59184', '--delete', src , user+'@'+host+':'+dir ], {env: process.env, stdio: 'inherit'});
	});
	
};

module.exports = deploy;