const http = require('http');
const fs = require('fs');
const port = 3000;

const requestHandler = (req, res) => {

    console.log('request: '+req.url);

    fs.readFile('./app/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}

const server = http.createServer(requestHandler);

server.listen(port, (err) =>{
    if(err){
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});

