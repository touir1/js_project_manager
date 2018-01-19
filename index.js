
//// declaration of imports ////
var 
    http = require('http'),
    fs = require('fs'),
    path = require('path');

//// declaration of parameters ////
var
    port = 3000;

//// path validator ////
var getFilePath = function(requestURL){
    var filePath = './app' + requestURL;
    if (filePath == './app/')
        filePath = './app/index.html';
    else if(filePath.indexOf('./app/node_modules')==0){
        filePath = './'+filePath.substr(filePath.indexOf('node_modules'));
    }

    return filePath;
}

//// function to get the content type ////
var getContentType = function(extname){
    var extensions = ['.js','.css','.json','.png','.jpg','.ico'];
    var contentTypes = ['text/javascript','text/css','application/json','image/png','image/jpg','image/x-icon'];
    var idx = extensions.indexOf(extname);
    
    return ((idx == -1)? 'text/html': contentTypes[idx]);
}

//// the request error handler ////
var errorHandler = function(error, contentType, response){
    if(error.code == 'ENOENT'){
        fs.readFile('./app/404.html', function(error, content) {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        });
    }
    else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        response.end(); 
    }
}


//// the error handler ////
var requestHandler = function(request, response) {

    console.log('request: '+request.url);

    var filePath = getFilePath(request.url);
    var extname = path.extname(filePath);
    var contentType = getContentType(extname);

    console.log('filePath: '+filePath);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            errorHandler(error, contentType, response);
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

//// server creation ////
var server = http.createServer(requestHandler);

//// starting server ////
server.listen(port, function(err) {
    if(err){
        return console.log('something bad happened', err);
    }

    console.log( 'server is listening on '+port);
});

