const postgres = require('postgres');
const config = require('../config');

async function query(sql, params) {
  const connection = await postgres.createConnection(config.db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}