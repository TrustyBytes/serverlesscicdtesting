const serverless = require('serverless-http');
const express = require('express');
const axios = require('axios');
const { connectToDatabase } = require('./connectMongo');
const app = express();

app.use(express.json({ extended: false })); //Initializing bodyparser middleware

app.get('/createauthtoken', async (req, res, next) => {
	let { db } = await connectToDatabase();
	const { code } = req.params;

	try {
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
			redirect_uri: 'https://1v7y9phwv5.execute-api.ap-south-1.amazonaws.com',
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
		let doc = await db.collection('authtokenObject').insertOne({ data });
		return res.status(200).json({ doc, data });
	} catch (error) {
		res.status(500).json({ error });
	}
});

app.post('/webhookendpoint', async (req, res, next) => {
	let { db } = await connectToDatabase();

	const { data } = req.body;

	const refreshToken =
		'T1|0QozfYFs5cLK528+eZKGSVwmgcdl9scmIXxgb1XPcmID|AN+9lM2VEj0duQ5m6qGhH1oqrlOcdK13TIx4TUyH+BU=';

	try {
		// Readying the config
		const config = {
			headers: {
				Authorization: 'Bearer ' + refreshToken,
				'user-agent': 'trustybytesqr8',
			},
		};

		// Send a request to the orders API endpoint and get order information
		const responseObject = await axios.get(
			`https://api.squarespace.com/1.0/commerce/orders/${data.orderId}`,
			config
		);
		const orderDetails = await responseObject.body;

		// Store order details in Database
		let doc = await db.collection('orderDetails').insertOne({ orderDetails });
		return res.status(200).json({ doc });
	} catch (error) {
		res.status(500).json({ error });
	}
});

app.use((req, res, next) => {
	return res.status(404).json({
		error: 'Wrong Path, dumbass',
	});
});

module.exports.main = serverless(app);
