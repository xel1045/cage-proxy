// nohup node server.js &

var http = require('http'),
		url = require('url'),
		fs = require('fs');

var port = 9000;

var proxyRequest = function(request, response, requestOpts) {
	var proxy = http.request(requestOpts, function(res) {
		res.on('data', function(chunk) {
			response.write(chunk, 'binary');
		});

		res.on('end', function() {
			response.end();
		});

		res.on('error', function(err) {
			console.log('ERROR SOMEWHERE');
		});

		response.writeHead(res.statusCode, res.headers);
	});

	request.on('data', function(chunk) {
		proxy.write(chunk, 'binary');
	});

	request.on('end', function() {
		proxy.end();
	});

	request.on('error', function(err) {
		console.log('Error');
	});
};

var httpServer = http.createServer(function(request, response) {
	var parsedUrl = url.parse(request.url);

	console.log(parsedUrl.path);

	if (parsedUrl.path && parsedUrl.path.match(/(png|jpe?g|git)$/)) {
		proxyRequest(request, response, {
			hostname: 'www.placecage.com',
			port: 80,
			method: 'GET',
			path: '/gif/200/300'
		});
	} else {
		proxyRequest(request, response, {
			headers: request.headers,
			hostname: parsedUrl.hostname,
			port: parsedUrl.port || 80,
			method: request.method,
			path: parsedUrl.path
		});
	}
});

httpServer.listen(port, function() {
	console.log('HTTP Proxy Server is listening on port: ' + port);
});
