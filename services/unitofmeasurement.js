const axios = require('axios');

async function getUoMFromFintoApi( link ) {

    const url = preProcessApiLink( link );
    const uom = await getUoM( url );

    return uom;
}

function preProcessApiLink( link ) {

    let url = 'http://finto.fi/rest/v1/ucum/data?uri=http%3A%2F%2Furn.fi%2FURN%3ANBN%3Afi%3Aau%3Aucum%3Ar';
    let parts = '';

    if ( link.includes( ':au:ucum:r' ) ) {

        parts = link.split( ':au:ucum:r' );  

    } else {

        parts = link.split( 'page/r' );

    }

    url = url.concat( parts[ parts.length - 1 ], '&format=application/ld%2Bjson' );

    return url;
}

async function getUoM( url ) {
    try {

        const res = await axios.get( url );
        const graph = res.data.graph;

        for ( let i = 0; i < graph.length; i++ ) {

            if ( 'http://urn.fi/URN:NBN:fi:au:ucum:p1' in graph[i] ) {

                value = graph[i].prefLabel.value;
    
            }
    
        }
        
        return value;

    } catch ( err ) {

        console.error( err );

    }
};

function processFintoData( uom ) {
    let value = '';

    for ( let i = 0; i < uom.graph.length; i++ ) {
        if ( 'http://urn.fi/URN:NBN:fi:au:ucum:p1' in uom.graph[i] ) {
            value = uom.graph[i].prefLabel.value;
            console.log("value", value );

        }

    }

    return value; 
}

module.exports = {
    getUoMFromFintoApi
}