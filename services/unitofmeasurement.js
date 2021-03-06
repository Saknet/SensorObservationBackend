const got = require( 'got' );
const asyncRedis = require( 'async-redis' );
const client = asyncRedis.createClient( {
    host: 'redis-server',
    port: 6379
} );

client.on( 'Redis error' , ( err ) => {
    console.log( err );
} );

/**
 * Calls other functions need to retrive uom from Finto API
 *
 * @param { Map<number, Array<number>> } timeValuePairs map containg observation result time-value pairs and count of observations
 * @param { Array<number> } timepoints generated timepoints between startTime and endTime in unix time
 * @param { object } timeseries without results
 */
function getUoMFromFintoApi ( link ) {

    const url = preProcessApiLink( link );
    const uom = getUoM( url );
    return uom;

}

function preProcessApiLink ( link ) {

    // case of air quality sensors
    if ( link === 'http://finto.fi/mesh/en/page/D052638' ) {

        return 'https://finto.fi/rest/v1/mesh/data?uri=http%3A%2F%2Fwww.yso.fi%2Fonto%2Fmesh%2FD052638&format=application/ld%2Bjson';

    }

    let fintoBaseUrl = 'https://finto.fi/rest/v1/ucum/';
    let url = 'data?uri=http%3A%2F%2Furn.fi%2FURN%3ANBN%3Afi%3Aau%3Aucum%3Ar';
    let parts = '';

    if ( link.includes( ':au:ucum:r' ) ) {

        parts = link.split( ':au:ucum:r' );

    } else {

        parts = link.split( 'page/r' );

    }

    url = url.concat( parts[ parts.length - 1 ], '&format=application/ld%2Bjson' );

    return fintoBaseUrl.concat( url );

}

async function getUoM ( fintourl ) {

    const cachedData = await client.get( fintourl );

    if ( cachedData ) {
        return cachedData;
    }

    const response = await got( fintourl );
    const body = JSON.parse( response.body );
    const graph = body.graph;

    for ( let i = 0, len = graph.length; i < len; i++ ) {

        if ( 'http://urn.fi/URN:NBN:fi:au:ucum:p1' in graph[ i ] ) {

            client.setex( fintourl, 6000, String( graph[ i ].prefLabel.value ) );
            return graph[ i ].prefLabel.value;

        }

        if ( fintourl === 'https://finto.fi/rest/v1/mesh/data?uri=http%3A%2F%2Fwww.yso.fi%2Fonto%2Fmesh%2FD052638&format=application/ld%2Bjson' ) {
            client.setex( fintourl, 6000, String( 'particulate matter' ) );
            return 'particulate matter';

        }
    }
}

module.exports = {
    getUoMFromFintoApi,
    preProcessApiLink
};