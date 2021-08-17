const { setup } = require( 'axios-cache-adapter' );

// TODO get cache working
const api = setup({
    // `axios` options
    baseURL: 'https://finto.fi/rest/v1/ucum/',
  
    // `axios-cache-adapter` options
    cache: {
      maxAge: 15 * 60 * 1000
    }
  })

function getUoMFromFintoApi( link ) {

    const url = preProcessApiLink( link );
    const uom = getUoM( url );

    return uom;
}

function preProcessApiLink( link ) {

    let url = 'data?uri=http%3A%2F%2Furn.fi%2FURN%3ANBN%3Afi%3Aau%3Aucum%3Ar';
    let parts = '';

    if ( link.includes( ':au:ucum:r' ) ) {

        parts = link.split( ':au:ucum:r' );  

    } else {

        parts = link.split( 'page/r' );

    }

    url = url.concat( parts[ parts.length - 1 ], '&format=application/ld%2Bjson' );

    return url;
}


async function getUoM( fintourl ) {
    const response = await api.get( fintourl );
    const graph = response.data.graph;
    
    for ( let i = 0; i < graph.length; i++ ) {
        
        if ( 'http://urn.fi/URN:NBN:fi:au:ucum:p1' in graph[ i ] ) {
            
            return graph[ i ].prefLabel.value;

        }
    }
}

module.exports = {
    getUoMFromFintoApi
}