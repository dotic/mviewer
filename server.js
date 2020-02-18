const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((request, response) => {
    let filePath = '.' + request.url;

    const indexOfQuery = filePath.indexOf('?');
    if (indexOfQuery > -1) {
        filePath = filePath.substring(0, indexOfQuery);
    }

    const indexOfAnchor = filePath.indexOf('#');
    if (indexOfAnchor > -1) {
        filePath = filePath.substring(0, indexOfAnchor);
    }

    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svh': 'image/svg+xml',
        '.txt': 'text/plain',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            console.error('[Error] ' + request.url + ' ' + error.message);
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Erreur serveur');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
