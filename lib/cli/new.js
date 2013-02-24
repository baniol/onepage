var path = require('path'),
	ncp = require('ncp').ncp,
	fs = require('fs'),
  compile = require(path.join(__dirname, './compile')),

newSite = function(argv){
	var location = argv._[1];
  if (!(location != null) || !location.length) {
    console.error('you must specify a location');
    return;
  }
  var from = path.join(__dirname, '../../res');
  var to = path.resolve('./',location,'res/');
  mkdir(to);
  ncp(from, to,function(error){
  	if(error)
  		console.log(error);
  	else
  		console.log('New site generated!');
  });
  // copy public
  var from = path.join(__dirname, '../../public');
  var to = path.resolve('./',location,'public');
  mkdir(to);
  ncp(from, to,function(error){
  	if(error)
  		console.log(error);
  	else{
      // initial compilation
      var loc = path.resolve('./',location);
      compile.compileAll(loc);
    }
  });
},

mkdir = function(path, root) {

    var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';

    try { fs.mkdirSync(root); }
    catch (e) {
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }

    return !dirs.length||mkdir(dirs.join('/'), root);
};

module.exports = newSite;