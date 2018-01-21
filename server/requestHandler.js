//// declaration of imports ////
var path = require("path"),
  fs = require("fs");

//// declaration of local imports ////
var utils = require("./utils");

//// configuration files ////
var projectEntryPoint = require("./config/projectsEntryPoint");

//// response Handler ////
var responseHandler = function(data, contentType, response) {
  response.writeHead(200, { "Content-Type": contentType });

  if (typeof data === "object" && !Buffer.isBuffer(data)) {
    response.end(JSON.stringify(data), "utf-8");
  } else {
    response.end(data, "utf-8");
  }
};

//// http response handler ////
var httpResponseHandler = function(requestURL, response) {
  if (requestURL === "/projectList") {
    //var dirs = utils.getDirs("./projects");
    responseHandler(
      { data: projectEntryPoint },
      utils.getContentType(".json"),
      response
    );
  }
};

//// path validator ////
var getFilePath = function(requestURL) {
  var filePath = "";
  if (requestURL === "/") {
    filePath = "./app/index.html";
  } else if (
    requestURL.indexOf("/node_modules") === 0 ||
    requestURL.indexOf("/projects") === 0
  ) {
    filePath = "." + requestURL;
  } else {
    filePath = "./app" + requestURL;
  }

  return filePath;
};

//// verify if it's a HTTP Request by request URL ////
var isHTTPRequest = function(requestURL) {
  return requestURL.indexOf(".") == -1 && requestURL != "/";
};

//// the request error handler ////
var errorHandler = function(error, contentType, response) {
  if (error.code === "ENOENT") {
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

//// the request handler ////
exports.handle = function(request, response) {
  console.log("request: " + request.url);

  if (!isHTTPRequest(request.url)) {
    var filePath = getFilePath(request.url);
    var extname = path.extname(filePath);
    var contentType = utils.getContentType(extname);
    fs.readFile(filePath, function(error, content) {
      if (error) {
        errorHandler(error, contentType, response);
      } else {
        responseHandler(content, contentType, response);
      }
    });
  } else {
    httpResponseHandler(request.url, response);
  }
};
