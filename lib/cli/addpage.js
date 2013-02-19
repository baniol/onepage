var watch = require('watch'),
	argv = require('optimist').argv,
	walk = require('walk'),
	fs = require('fs'),
	compile = require('./compile');

var _resPagesDir = './res/_pages';

var addPage = function(){

	var pagename = argv._[1];
	  if (!(pagename != null) || !pagename.length) {
	    console.error('you must specify a page name');
	    return;
	  }

	countSourcePages(function(cnt,names){
		var rawName = pagename.toLowerCase().replace(/ /g,'_');
		if(names.indexOf(rawName + '.markdown') != -1){
			// @todo - replace console.logs with throw Error
			console.log('This name is already in use!');
			return false;
		}
		var newFile = _resPagesDir + '/' + rawName + '.markdown';
		var newPageTemplate = fs.readFileSync('./res/newPageTemplate', 'utf8');
		var pageContent = newPageTemplate;
		pageContent = pageContent.replace('@@order@@',cnt+1)
					.replace('@@page_title@@',pagename)
					.replace('@@menu_title@@',pagename)
					.replace('@@slug@@',rawName);
		fs.writeFile(newFile, pageContent, function(err){
		    if(err) {
		        console.error("Error saving file %s", err);
		    }
		    console.log('New page generated: %s',newFile);
		    compile.makeStatic();
		});
	});
};

var countSourcePages = function(fn){
	var count = 0,
		walker = walk.walk(_resPagesDir, { followLinks: false }),
		names = [];

	walker.on('file', function(root, stat, next) {
	    count++;
	    names.push(stat.name);
	    next();
	});

	walker.on('end', function() {
	    fn(count,names);
	});
}

module.exports = addPage;