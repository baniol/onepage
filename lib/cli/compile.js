var path = require('path'),
    tools = require(path.join(__dirname, '../tools')),
    jade = require('jade'),
    fs = require('fs'),
    less = require('less'),
    md = require("node-markdown").Markdown,
    walk    = require('walk'),
    argv = require('optimist').argv,
    mainLess = './res/less/main.less',
    _resPagesDir = './res/_pages',
    resDir = './res',
    pagesDir = resDir+'/_pages/',

compile = function(){
  config = readConfig();
  compileAll();
},

readConfig = function(location){
  var confFile = location === undefined ? './res/config.json' : location+'/res/config.json';
  return JSON.parse(fs.readFileSync(confFile, 'utf8',function(error){}));
},

compileAll = function(location,fn){
  makeStatic(location);
  compileLess(location);
  if(typeof fn == 'function')
    fn();
},

// read all files (markdown source files & jade templates) & compile html page
makeStatic = function(location){
  var pagesDir = location === undefined ? _resPagesDir : location+'/res/_pages';
  // get markdown files
  var files   = [];
  var walker  = walk.walk(pagesDir, { followLinks: false });
  walker.on('file', function(root, stat, next) {
      files.push(root + '/' + stat.name);
      next();
  });
  walker.on('end', function() {
      var structure = makePagesArray(files);
      complileJade(structure,location);
  });
},

compileLess = function(location){
  var srcLess = location === undefined ? './res/less/main.less' : location + '/res/less/main.less',
      mainLess =  fs.readFileSync(srcLess, 'utf8');

  // set color theme from config.json
  var conf = readConfig(location);
  mainLess = mainLess.replace('@@color_theme@@',conf.color_theme);

  var imports= location === undefined ? './res/less' : location+'/res/less',
      lessOutput = location === undefined ? './public/css/app.css' : location + '/public/css/app.css',
      parser = new(less.Parser)({
          paths: [imports], // Specify search paths for @import directives
          filename: 'style.less' // Specify a filename, for better error messages
      });
    
  parser.parse(mainLess, function (e, tree) {
      var out = tree.toCSS({ compress: true }); // Minify CSS output
      // console.log(tree.toCSS({ compress: true }));
      fs.writeFile(lessOutput, out, function(err){
        if(err) {
           console.error("Error saving file %s", err);
        }
        console.log('Css file compiled and saved! '+ new Date());
    });
  });
},

makePagesArray = function(files){
  var pagesCollection = [];
  files.forEach(function(fileName){
      // parsing a file
      var pageData = parsePage(fileName);
      if(pageData.publish == true)
        pagesCollection.push(pageData);
    });
    // sort by order property
    pagesCollection.sort(collectionSort);
    return pagesCollection;
},

parsePage = function(fileName){
  var raw = fs.readFileSync(fileName, 'utf8'),
    sp = raw.split('//***//'),
    meta = tools.trim(sp[0]),
    markdown = tools.trim(sp[1]),
  // parse metadata
    pageTitle = '',
    menuTitle = '',
    pageSlug = '',
    pageIcon = '',
    publish = true,
    order,
    pm = meta.split('\n');

  for(var i=0;i<pm.length;i++){
    var r = pm[i].split(":");
    var key = r[0];
    var value = r[1];
    if(key == 'title'){
      pageTitle = value;
    }
    if(key == 'menu_title'){
      menuTitle = value;
    }
    if(key == 'slug'){
      pageSlug = value;
    }
    if(key == 'icon'){
      pageIcon = value;
    }
    if(key == 'publish' && value == 'false'){
      publish = false;
    }
    if(key == 'order'){
      order = value;
    }
  }
  var content = md(markdown);
  return{
    title:pageTitle,
    menu_title:menuTitle,
    slug:pageSlug,
    icon:pageIcon,
    publish:publish,
    content:content,
    order:order
  };
},

complileJade = function(pages,location){
  var layout = location === undefined ?  './res/templates/main.jade' : location+'/res/templates/main.jade';
  // @todo code repetition
  var tmpl = jade.compile(fs.readFileSync(layout, 'utf8'),
      {
        filename:layout,
        pretty:true
      });
  var config = readConfig(location);
  var data = {md:md,pages:pages,pageTitle:config.pageTitle};
  var target = location === undefined ? './public/index.html' : location + '/public/index.html';

  fs.writeFile(target, tmpl(data), function(err){
      if(err) {
          console.error("Error saving file %s", err);
      }
      console.log('Html template compiled and saved! '+ new Date());
  });
},

collectionSort = function(a,b){
  var aName = a.order.toLowerCase();
  var bName = b.order.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};

module.exports = compile;
module.exports.compileAll = compileAll;
module.exports.makeStatic = makeStatic;
module.exports.compileLess = compileLess;
