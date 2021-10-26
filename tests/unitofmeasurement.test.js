const { preProcessApiLink } = require( '../services/unitofmeasurement' );

describe( "pre processing api link", () => {
    const uomlist = [ 'http://finto.fi/ucum/en/page/r63', 'http://finto.fi/ucum/en/page/r59', 'http://finto.fi/ucum/en/page/r57', 'http://finto.fi/ucum/en/page/r73', 'http://finto.fi/ucum/en/page/r61', 'http://finto.fi/mesh/en/page/D052638' ]


    test( 'Ucum values', () => {

        for ( let i = 0, len = uomlist.length - 1; i < len; i++ ) {
            expect( preProcessApiLink( uomlist[ i ] ) ).toContain( 'https://finto.fi/rest/v1/ucum/data?uri=http%3A%2F%2Furn.fi%2FURN%3ANBN%3Afi%3Aau%3Aucum%3Ar' );
            expect( preProcessApiLink( uomlist[ i ] ) ).toContain( '&format=application/ld%2Bjson' );
        }

    } )

    test( 'Mesh value', () => {

        expect( preProcessApiLink( uomlist.pop() ) ).toEqual( 'https://finto.fi/rest/v1/mesh/data?uri=http%3A%2F%2Fwww.yso.fi%2Fonto%2Fmesh%2FD052638&format=application/ld%2Bjson' );

    } )
    
})