var http = require('http');
var fs = require('fs');
var path = require('path');
var spotify = require('./app.js');

http.createServer(function(req, res){

    if(req.url === "/"){
        fs.readFile("main.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    }else if(req.url.match("\.css$")){
        var cssPath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    } else if (req.url == '/app.js') {
        fs.readFile('./app.js', function (err, jsFile) {
            if (err) {
                res.send(500, { error: err });
            }
            res.writeHeader(200, { "Content-Type": "text/javascript" });
            res.write(jsFile);
            res.end();
        });
    }else{
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }

}).listen(3000);