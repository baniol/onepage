var path = require('path'),
    optimist = require('optimist'),
    fs = require('fs');

var main = function() {
  var argv = optimist.argv;
  var cmd;
  if (argv._[0] != null) {
    try {
      cmd = require("./" + argv._[0]);
    } catch (error) {
      console.log("'" + argv._[0] + "' - no such command");
      return process.exit(0);
    }
  }
  if (argv.version) {
    var pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    console.log(pack.version);
    return process.exit(0);
  }
  if (argv.help || !cmd) {
    console.log('You must provide a command!');
    process.exit(0);
  }
  if (cmd) {
    return cmd(optimist.argv);
  }
};

module.exports.main = main;
