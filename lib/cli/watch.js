var w = require('watch'),
	compile = require('./compile'),
	http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = 8000,
   	currDir = process.cwd(),
    resDir = currDir+'/res',

watch = function(){
	compile.compileAll();
	// the idea taken from Ryan Florence: https://gist.github.com/rpflorence/701407
	http.createServer(function(request, response) {
	  var uri = url.parse(request.url).pathname
	    , filename = path.join(process.cwd(),'./public/', uri);

	  var contentTypesByExtension = {
	    '.html': "text/html",
	    '.css':  "text/css",
	    '.js':   "text/javascript"
	  };

	  path.exists(filename, function(exists) {
	    if(!exists) {
	      response.writeHead(404, {"Content-Type": "text/plain"});
	      response.write("404 Not Found\n");
	      response.end();
	      return;
	    }

	    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

	    fs.readFile(filename, "binary", function(err, file) {
	      if(err) {        
	        response.writeHead(500, {"Content-Type": "text/plain"});
	        response.write(err + "\n");
	        response.end();
	        return;
	      }

	      var headers = {};
	      var contentType = contentTypesByExtension[path.extname(filename)];
	      if (contentType) headers["Content-Type"] = contentType;
	      response.writeHead(200, headers);
	      response.write(file, "binary");
	      response.end();
	    });
	  });
	}).listen(parseInt(port, 10));

	console.log("Static file server running at\n  => http://localhost:" + port + "/");
	console.log("Watching for changes...");

	w.watchTree(resDir, function (f, curr, prev) {
		if (typeof f == "object" && prev === null && curr === null) {
	      // Finished walking the tree
	    } else if (prev === null) {
	      compile.compileAll();
	    } else if (curr.nlink === 0) {
	      compile.compileAll();
	    } else {
			if(f.match('.jade')){
				// compileJade();
				compile.makeStatic();
			}
			if(f.match('.less')){
				compile.compileLess();
			}
			if(f.match('.markdown')){
				// compileJade(f);
				compile.makeStatic();
			}
	    }
	});
};

module.exports = watch;
