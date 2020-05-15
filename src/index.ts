import http from 'http';
import url from 'url';
import fs from 'fs';
import mime from 'mime';
import dotenv from 'dotenv';
import filesDict from './store/fileIndex';

dotenv.config();

function sendFile(res, filePath) {
    res.writeHead(200, { 'Content-Type': mime.lookup(filePath) });
    // Pipe the file stream into the response stream
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}

function sendJson(res, json) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(json);
}

// Figure out port number
const portNumber = process.env.PORT || 8000;

// Create HTTP server
const server = http.createServer(function (req, res) {
    // Examine URL, get requested file path
    let { pathname: pathName } = url.parse(req.url, true);
    if (pathName === "/" || pathName.indexOf("..") > -1) {
        pathName = "/index.html";
    }
    console.log({ pathName: pathName });
    const filePath = __dirname + pathName;

    if (pathName.split('/')[2] === 'dict') {
        sendJson(res, JSON.stringify(filesDict));
        return;
    }

    console.log("requested:", req.url, filePath);
    fs.exists(filePath, function (exists) {
        if (!exists) {
            const [, , fileNumber] = pathName.split('/');
            const partialFilePath = filesDict[fileNumber] || null;
            console.log({ fileNumber, partialFilePath });
            if (partialFilePath) {
                const derivedFilePath = __dirname + `/images/${partialFilePath}`;
                console.log({ derivedFilePath });
                sendFile(res, derivedFilePath);
                return;
            }
            // Return with 404
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("There is no such thing on this server.");
            return;
        }
        sendFile(res, filePath);
    });
});
// Start server
server.listen(portNumber);

console.log("web server listening on: " + portNumber);