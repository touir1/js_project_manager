//// declaration of imports ////
var http = require("http");

//// declaration of local imports ////
var utils = require("./utils"),
  requestHandler = require("./requestHandler");

//// declaration of parameters ////
var port = 3000;

//// server creation ////
var server = http.createServer(requestHandler.handle);

//// starting server ////
server.listen(port, function(err) {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log("server is listening on " + port);
  var dirs = utils.getDirs("./projects");
  console.log("projects list: ", dirs);
});
