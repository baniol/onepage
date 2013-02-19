var path = require('path'),
    optimist = require('optimist'),
    fs = require('fs'),
    // @todo - change usage - authomatic generation
    usage = "\nusage: wintersmith [optins] [command]\n\ncommands:\n\n  " + 'build'.bold + " [options] - build a site\n  " + 'preview'.bold + " [options] - run local webserver\n  " + 'new'.bold + " <location> - create a new site\n\n  also see [command] --help\n\nglobal options:\n\n  -v, --verbose   show debug information\n  -q, --quiet     only output critical errors\n  -V, --version   output version and exit\n  -h, --help      show help\n";

var main = function() {
  var argv = optimist.argv;
  var cmd;
  // console.log(argv._[0]);
  if (argv._[0] != null) {
    try {
      cmd = require("./" + argv._[0]);
    } catch (error) {
      console.log("'" + argv._[0] + "' - no such command");
      // @todo ?? - check process
      return process.exit(0);
    }
  }
  if (argv.version) {
    var pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    console.log(pack.version);
    return process.exit(0);
  }
  if (argv.help || !cmd) {
    console.log(cmd ? cmd.usage : usage);
    process.exit(0);
  }
  if (cmd) {
    // @todo - options ??
    return cmd(optimist.argv);
  }
};

module.exports.main = main;
