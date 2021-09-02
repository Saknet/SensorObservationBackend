const redis = require( 'redis' );
const redisPort = 6379;
const client = redis.createClient( redisPort );
const got = require('got');

client.on( "error" , ( err ) => {
    console.log( err );
})

async function getUoMFromFintoApi ( link ) {

    const url = preProcessApiLink( link );
    const uom = getUoM( url );

    return uom;

}

function preProcessApiLink ( link ) {
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

async function getUoM( fintourl ) {

    const response = await got( fintourl );
    const body = JSON.parse( response.body );
    console.log("response", body );
    console.log("graph", body.graph );

    const graph = body.graph;

    for ( let i = 0; i < graph.length; i++ ) {
        
        if ( 'http://urn.fi/URN:NBN:fi:au:ucum:p1' in graph[ i ] ) {

            client.setex( fintourl, 600, String( graph[ i ].prefLabel.value ) )
            return graph[ i ].prefLabel.value;

        }
    }
}

module.exports = {
    getUoMFromFintoApi
};