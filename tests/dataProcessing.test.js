const { preProcessdata } = require( '../services/dataProcessing' );
const { generateTestData } = require( './testdatageneration' );

describe( "Pre processing data", () => {
    let testdata;
    let processedData;
    let endHours;
    let startTime;
    let startHours;    
    let n;
    const uomlist = [ 'http://finto.fi/ucum/en/page/r63', 'http://finto.fi/ucum/en/page/r59', 'http://finto.fi/ucum/en/page/r57', 'http://finto.fi/ucum/en/page/r73', 'http://finto.fi/ucum/en/page/r61', 'http://finto.fi/mesh/en/page/D052638' ]


    beforeEach(() => {
        endHours = Math.floor( Math.random() * 1001 );
        startHours = 2 + endHours + Math.floor( Math.random() * 1001 );
        startTime = new Date( Date.now() - 3600000 * startHours );
        n = ( startHours - endHours ) * 100;

        testdata = generateTestData( startTime.getTime(), n, startHours - endHours, uomlist );
        processedData = preProcessdata( testdata );
    });

    test( 'Random values', () => {
        expect( processedData ).toHaveLength( 6 )

        for ( let i = 0, len = processedData.length; i < len; i++ ) {
            expect( processedData[i] ).toHaveProperty( 'uom' );
            expect( processedData[i] ).toHaveProperty( 'observations' );
        }
    } )
    
})