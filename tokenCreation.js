const serverless = require('serverless-http');
const express = require('express');
const axios = require('axios');
const { connectToDatabase } = require('./connectMongo');
const app = express();

app.use(express.json({ extended: false })); //Initializing bodyparser middleware

app.get('/', async (req, res, next) => {
	let { db } = await connectToDatabase();
	const { code } = req.params;

	// Decode the url encoded code param
	const decodedParam = decodeURIComponent(code);

	// Base64 encode client_id and client_secret
	const butt =
		'sNbZFoinWycLueLDaOiAKd1NKouvDd5S:ha6nNRjs4qlj6pR8RCMuiZMeyYAAvCl8LUxDHeETyi4=';
	const base64Encoded = Buffer.from(butt).toString('base64');

	// Readying the body and config
	const body = JSON.stringify({
		grant_type: 'authorization_code',
		code: decodedParam,
		redirect_uri: '*same as the redirect url given while authorizing*',
	});
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'user-agent': 'trustybytes_qr8code',
			Authorization: 'Basic ' + base64Encoded,
		},
	};

	// Send a request to squarespace to get the token object with auth token and refresh token
	const responseObject = await axios.post(
		'https://login.squarespace.com/api/1/login/oauth/provider/tokens',
		config,
		body
	);
	const data = responseObject.body;

	// Add the object to mongodb database
	let doc = await db.collection('corsTesting').insertOne({ data });
	return res.status(200).json({ doc, data });
});

app.use((req, res, next) => {
	return res.status(404).json({
		error: 'Wrong Path, dumbass',
	});
});

module.exports.authTokenCreation = serverless(app);
