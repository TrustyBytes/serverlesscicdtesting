const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
	return res.status(200).json({
		message: 'Hello from root!',
	});
});

app.get('/hello', (req, res, next) => {
	return res.status(200).json({
		message: 'Hello from Shamariyan',
	});
});

app.use((req, res, next) => {
	return res.status(404).json({
		error: 'get out',
	});
});

module.exports.handler = serverless(app);
