/* Load the HTTP library */
const http = require("http");

const hostname = 'localhost';
const port = 3000;


/* Create an HTTP server to handle responses */

const server = http.createServer(function(request, response) {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain');
	response.end('Hello World!\n');
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://$(hostname):$(port)/`);
});
