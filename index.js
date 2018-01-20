//// declaration of imports ////
var http = require("http"),
  fs = require("fs"),
  path = require("path"),
  _ = require("lodash");

//// declaration of parameters ////
var port = 3000;

//// path validator ////
var getFilePath = function(requestURL) {
  var filePath = "./app" + requestURL;
  if (filePath == "./app/") filePath = "./app/index.html";
  else if (filePath.indexOf("./app/node_modules") == 0) {
    filePath = "./" + filePath.substr(filePath.indexOf("node_modules"));
  }

  return filePath;
};

//// function to get the content type ////
var getContentType = function(extname) {
  var extensions = [".js", ".css", ".json", ".png", ".jpg", ".ico"];
  var contentTypes = [
    "text/javascript",
    "text/css",
    "application/json",
    "image/png",
    "image/jpg",
    "image/x-icon"
  ];
  var idx = extensions.indexOf(extname);

  return idx == -1 ? "text/html" : contentTypes[idx];
};

var isUndefined = function(element) {
  return typeof element == "undefined";
};

//// function to get dir names in a given directory ////
var getDirs = function(rootDir) {
  var files = fs.readdirSync(rootDir);
  var dirs = _.filter(files, function(file) {
    var filePath = rootDir + "/" + file;
    var stat = fs.statSync(filePath);
    return stat.isDirectory();
  });
  return isUndefined(dirs) ? [] : dirs;
};

//// the request error handler ////
var errorHandler = function(error, contentType, response) {
  if (error.code == "ENOENT") {
    fs.readFile("./app/404.html", function(error, content) {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    });
  } else {
    response.writeHead(500);
    response.end(
      "Sorry, check with the site admin for error: " + error.code + " ..\n"
    );
    response.end();
  }
};

//// verify if it's a HTTP Request by request URL ////
var isHTTPRequest = function(requestURL) {
  return requestURL.indexOf(".") == -1 && requestURL != '/';
};

//// response Handler ////
var responseHandler = function(data, contentType, response) {
  response.writeHead(200, { "Content-Type": contentType });
  
  if(typeof data == 'object' && !Buffer.isBuffer(data)){
    response.end(JSON.stringify(data), "utf-8");
  }
  else{
    response.end(data, "utf-8");
  }
  
};

//// http response handler ////
var httpResponseHandler = function(requestURL, response){
    if(requestURL == '/projectList'){
        var dirs = getDirs("./projects");
        console.log(dirs);
        responseHandler({'data': dirs}, getContentType(".json"), response);
    }
};

//// the request handler ////
var requestHandler = function(request, response) {
  console.log("request: " + request.url);

  if (!isHTTPRequest(request.url)) {
    var filePath = getFilePath(request.url);
    var extname = path.extname(filePath);
    var contentType = getContentType(extname);
    fs.readFile(filePath, function(error, content) {
      if (error) {
        errorHandler(error, contentType, response);
      } else {
        responseHandler(content, contentType, response);
      }
    });
  } else {
    httpResponseHandler(request.url,response);
  }
};

//// server creation ////
var server = http.createServer(requestHandler);

//// starting server ////
server.listen(port, function(err) {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log("server is listening on " + port);
  var dirs = getDirs("./projects");
  console.log("projects list: ", dirs);
});
