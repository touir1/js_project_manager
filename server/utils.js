//// declaration of imports ////
var fs = require("fs"),
  _ = require("lodash");

//// verify if element is undefined ////
exports.isUndefined = function(element) {
  return typeof element === "undefined";
};

//// function to get dir names in a given directory ////
exports.getDirs = function(rootDir) {
  var files = fs.readdirSync(rootDir);
  var dirs = _.filter(files, function(file) {
    var filePath = rootDir + "/" + file;
    var stat = fs.statSync(filePath);
    return stat.isDirectory();
  });
  return this.isUndefined(dirs) ? [] : dirs;
};

//// function to get the content type ////
exports.getContentType = function(extname) {
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
  
    return idx === -1 ? "text/html" : contentTypes[idx];
  };