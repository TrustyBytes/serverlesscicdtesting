const { Db, MongoClient } = require('mongodb')``;

const MONGODB_URI =
	'mongodb+srv://trustybytes:trustybytes_1234@cluster0.abfah.mongodb.net/qr_application?retryWrites=true&w=majority';
const MONGODB_DB = 'qr_application';

let cachedClient;
let cachedDb;

module.exports = async function connectToDatabase() {
	// check the cached.
	if (cachedClient && cachedDb) {
		// load from cache
		return {
			client: cachedClient,
			db: cachedDb,
		};
	}

	// set the connection options
	const opts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	// check the MongoDB URI
	if (!MONGODB_URI) {
		throw new Error('Define the MONGODB_URI environmental variable');
	}
	// check the MongoDB DB
	if (!MONGODB_DB) {
		throw new Error('Define the MONGODB_DB environmental variable');
	}

	// Connect to cluster
	let client = new MongoClient(MONGODB_URI);
	await client.connect();
	let db = client.db(MONGODB_DB);

	// set cache
	cachedClient = client;
	cachedDb = db;
	console.log('MONGO connected');

	return {
		client: cachedClient,
		db: cachedDb,
	};
};
