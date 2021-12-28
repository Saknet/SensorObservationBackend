const { Pool } = require( 'pg' );
const config = require( '../config' );
const pool = new Pool( config.config.db );
const poolFVH = new Pool( config.configFVH.db );

/**
 * Queries the database using the pool
 *
 * @param {*} query
 * @param {*} params
 * @return rows, matching rows from database
 *
 * @see https://node-postgres.com/features/pooling#single-query
 */
async function query ( query, params ) {
    const { rows } = await pool.query( query, params );

    return rows;
}

/**
 * Queries the FVH database using the pool
 *
 * @param {*} query
 * @param {*} params
 * @return rows, matching rows from database
 *
 * @see https://node-postgres.com/features/pooling#single-query
 */
async function queryFVH ( query, params ) {
    const { rows } = await poolFVH.query( query, params );

    return rows;
}

module.exports = {
    query,
    queryFVH
};