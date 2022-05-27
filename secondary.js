const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
	return res.status(200).json({
		message: 'Hello from Secondary Function',
	});
});
app.use((req, res, next) => {
	return res.status(404).json({
		error: 'get out of secondary function',
	});
});

module.exports.secondaryFunction = serverless(app);
