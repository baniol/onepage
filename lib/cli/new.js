var path = require('path'),
	ncp = require('ncp').ncp,
	fs = require('fs'),
  compile = require(path.join(__dirname, './compile')),
  currDir = process.cwd(),
  tools = require('../tools'),
  separator = tools.getDirSeparator(),
  curDirr = process.cwd();

newSite = function(argv){
	var location = argv._[1];
  if (!(location != null) || !location.length) {
    console.error('You must specify a location!');
    return;
  }

  var from = path.join(__dirname, '../../res');
  // var to = path.resolve('/',location,'res/');
  var to = currDir + separator + location + separator + 'res';
  // console.log(to);return;
  mkdir(to);
  ncp(from, to,function(error){
  	if(error)
  		console.log(error);
  	else
  		console.log('New site generated!');
  });
  // copy public
  var from = path.join(__dirname, '../../public');
  // var to = path.resolve('./',location,'public');
  var to = currDir + separator + location + separator + 'public';
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
    var dirs = path.split(separator), dir = dirs.shift(), root = (root||'')+dir+separator;

    try { fs.mkdirSync(root); }
    catch (e) {
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }

    return !dirs.length||mkdir(dirs.join(separator), root);
};

module.exports = newSite;