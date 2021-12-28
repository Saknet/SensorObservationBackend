const dbService = require( './db' );

// only used for testing
async function getMultiple () {

    //  "SELECT * FROM featureofinterest WHERE feature->>'gmlid' = 'BID_4f77b0c3-812f-470b-b305-7c4807e2934f'"
    //  "SELECT table_schema,table_name FROM information_schema.tables"

    const rows = await dbService.query(
        'SELECT * FROM featureofinterest'
    //  "SELECT * FROM featureofinterest WHERE feature->>'gmlid' = 'BID_0a3a6049-77d6-4c9e-8486-c3469fe49cc7'"
    );

    const data = rows;


    return {
        data
    };
}

module.exports = {
    getMultiple
};