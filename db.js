const { Client } = require("pg");
const DB_URI =
	process.env.NODE_ENV === "test"
		? `postgresql://mack:mack@localhost:5432/biztime_test`
		: `postgresql://mack:mack@localhost:5432/biztime`;

const db = new Client({
	connectionString: DB_URI,
});

db.connect();

module.exports = db;
