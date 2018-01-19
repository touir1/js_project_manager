const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const getFilePath = function(requestURL){
    var filePath = './app' + requestURL;
    if (filePath == './app/')
        filePath = './app/index.html';
    else if(filePath.indexOf('./app/node_modules')==0){
        filePath = './'+filePath.substr(filePath.indexOf('node_modules'));
    }

    return filePath;
}

const getContentType = function(extname){
    var extensions = ['.js','.css','.json','.png','.jpg','.ico'];
    var contentTypes = ['text/javascript','text/css','application/json','image/png','image/jpg','image/x-icon'];
    var idx = extensions.indexOf(extname);
    
    return ((idx == -1)? 'text/html': contentTypes[idx]);
}

const requestHandler = (request, response) => {

    console.log('request: '+request.url);

    var filePath = getFilePath(request.url);
    var extname = path.extname(filePath);
    var contentType = getContentType(extname);

    console.log('filePath: '+filePath);

    fs.readFile(filePath, function(error, content) {
        if (error) {
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
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

const server = http.createServer(requestHandler);

server.listen(port, (err) =>{
    if(err){
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});

