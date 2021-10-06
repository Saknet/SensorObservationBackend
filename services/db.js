const { Pool } = require('pg');
const config = require('../config');
const pool = new Pool(config.config.db);
const poolFVH = new Pool(config.configFVH.db);

/**
 * Query the database using the pool
 * @param {*} query 
 * @param {*} params 
 * 
 * @see https://node-postgres.com/features/pooling#single-query
 */
async function query( query, params ) {
    const { rows, fields } = await pool.query( query, params );

    return rows;
}

/**
 * Query the FVH database using the pool
 * @param {*} query 
 * @param {*} params 
 * 
 * @see https://node-postgres.com/features/pooling#single-query
 */
 async function queryFVH( query, params ) {
  const { rows, fields } = await poolFVH.query( query, params );

  return rows;
}

module.exports = {
  query,
  queryFVH
}