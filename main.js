const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
	return res.status(200).json({
		message: 'Hello from updated code!',
	});
});

app.get('/hello', (req, res, next) => {
	return res.status(200).json({
		message: 'Hello from Sharan',
	});
});

app.use((req, res, next) => {
	return res.status(404).json({
		error: 'get out',
	});
});

module.exports.mainFunction = serverless(app);
