const { generateTimepoints, countObservationResults, addDataToTimeseries, generateTimeseries } = require( '../services/timeseries' );
const { preProcessdata } = require( '../services/dataProcessing' );
const { generateTestData, generateObservationDataForDates } = require( './testdatageneration' );
const defaultStartTime = new Date( Date.now() - 3600000 * 8 );
const defaultEndTime = new Date( Date.now() );
const got = require( 'got' );

describe( "Timepoints generation", () => {
    let timepoints;
    let endHours;
    let startTime;
    let endTime;
    let startHours;
    let defaultTimepoints;

    beforeEach(() => {
        endHours = Math.floor( Math.random() * 101 );
        endTime = new Date( Date.now() - 3600000 * endHours );
        startHours = 2 + endHours + Math.floor( Math.random() * 101 );
        startTime = new Date( Date.now() - 3600000 * startHours );
        timepoints = generateTimepoints( startTime, endTime );
        defaultTimepoints = generateTimepoints( defaultStartTime, defaultEndTime );
    });

    test( 'Default values', () => {
        expect( defaultTimepoints ).toHaveLength( 8 )
        expect( defaultTimepoints ).toContain( new Date( defaultStartTime ).getTime() / 1000 + 1800 )
        expect( defaultTimepoints ).toContain( new Date( defaultStartTime ).getTime() / 1000 + 1800 + 3600 * 5 )
    } )

    test( 'Random values', () => {
        expect( timepoints ).toHaveLength( startHours - endHours )
        expect( timepoints ).toContain( new Date( startTime ).getTime() / 1000 + 1800 + 3600 )
        expect( timepoints ).toContain( new Date( startTime ).getTime() / 1000 + 1800 + 3600 * ( startHours - endHours - 1 ) )
    } )
    
})

describe( "Add data to timeseries", () => {
    let timepoints;
    let randomNumber;
    let startTime;
    let endTime;
    let index;

    beforeEach(() => {
        randomNumber = Math.floor( Math.random() * 1001 );
        endTime = new Date( Date.now() - 3600000 * randomNumber );
        startTime = new Date( Date.now() - 3600000 * ( 2 + randomNumber + Math.floor( Math.random() * 1001 ) ) );
        index = Math.floor( Math.random() * randomNumber );
        timepoints = generateTimepoints( startTime, endTime );
    });

    test( 'With random dates', () => {
        const timeseries = addDataToTimeseries( timepoints[ index ], { uom: 'joule', timevaluepairs: [], averages: [], observationtimes: [] }, 5555, 4 );
        expect( timeseries ).toHaveProperty( 'averages', [1388.75] )
        expect( timeseries ).toHaveProperty( 'uom', 'joule' )
//        expect( timeseries ).toHaveProperty( 'timevaluepairs', [{"averagevalue": 1388.75, "observationscount": 4, "time": timepoints[ index ], "totalvalue": 5555}] )
    } )

} )

describe('count observation results', () => {
    let timepoints;
    let endHours;
    let startTime;
    let endTime;
    let startHours;

    beforeEach(() => {
        endHours = Math.floor( Math.random() * 1001 );
        endTime = new Date( Date.now() - 3600000 * endHours );
        startHours = 2 + endHours + Math.floor( Math.random() * 1001 );
        startTime = new Date( Date.now() - 3600000 * startHours );
        timepoints = generateTimepoints( startTime, endTime );
    });

    test( 'With random dates and data', () => {

        for ( let i = 0, len = timepoints.length; i < len; i++ ) {
            let value = Math.floor( Math.random() * 1000 );
            let generateddata = generateObservationDataForDates( timepoints[ i ], value );
            let results = countObservationResults( generateddata[ 0 ], timepoints[ i ] );
            expect( results ).toContain( value )
            expect( results ).toContain( generateddata[ 1 ] )
        }

    } )

} )

describe('count observation results', () => {
    let timepoints;
    let endHours;
    let startTime;
    let endTime;
    let startHours;

    beforeEach(() => {
        endHours = Math.floor( Math.random() * 1001 );
        endTime = new Date( Date.now() - 3600000 * endHours );
        startHours = 2 + endHours + Math.floor( Math.random() * 1001 );
        startTime = new Date( Date.now() - 3600000 * startHours );
        timepoints = generateTimepoints( startTime, endTime );
    });

    test( 'With random dates and data', () => {

        for ( let i = 0, len = timepoints.length; i < len; i++ ) {
            let value = Math.floor( Math.random() * 1000 );
            let generateddata = generateObservationDataForDates( timepoints[ i ], value );
            let results = countObservationResults( generateddata[ 0 ], timepoints[ i ] );
            expect( results ).toContain( value )
            expect( results ).toContain( generateddata[ 1 ] )
        }

    } )

} )

describe('generate timeseries', () => {
    let testdata;
    let processedData;
    let endHours;
    let startTime;
    let startHours;    
    let n;
    const uomlist = [ 'https://finto.fi/ucum/en/page/r59' ]
    jest.mock( 'got' );

    beforeEach(() => {
        endHours = Math.floor( Math.random() * 101 );
        endTime = new Date( Date.now() - 3600000 * endHours );
        startHours = 2 + endHours + Math.floor( Math.random() * 101 );
        startTime = new Date( Date.now() - 3600000 * startHours );
        n = ( startHours - endHours ) * 100;
        testdata = generateTestData( startTime.getTime(), n, startHours - endHours, uomlist );
        processedData = preProcessdata( testdata );

    });

    test( 'Watts with random dates and data', async ()  => {
        got.get = jest.fn().mockReturnValue({
            json: () => Promise.resolve(
                {
                    "@context":{
                       "skos":"http://www.w3.org/2004/02/skos/core#",
                       "isothes":"http://purl.org/iso25964/skos-thes#",
                       "rdfs":"http://www.w3.org/2000/01/rdf-schema#",
                       "owl":"http://www.w3.org/2002/07/owl#",
                       "dct":"http://purl.org/dc/terms/",
                       "dc11":"http://purl.org/dc/elements/1.1/",
                       "uri":"@id",
                       "type":"@type",
                       "lang":"@language",
                       "value":"@value",
                       "graph":"@graph",
                       "label":"rdfs:label",
                       "prefLabel":"skos:prefLabel",
                       "altLabel":"skos:altLabel",
                       "hiddenLabel":"skos:hiddenLabel",
                       "broader":"skos:broader",
                       "narrower":"skos:narrower",
                       "related":"skos:related",
                       "inScheme":"skos:inScheme",
                       "exactMatch":"skos:exactMatch",
                       "closeMatch":"skos:closeMatch",
                       "broadMatch":"skos:broadMatch",
                       "narrowMatch":"skos:narrowMatch",
                       "relatedMatch":"skos:relatedMatch"
                    },
                    "graph":[
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:Unit",
                          "type":"owl:Class",
                          "prefLabel":{
                             "lang":"en",
                             "value":"unit"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p1",
                          "label":{
                             "lang":"en",
                             "value":"code"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p2",
                          "label":{
                             "lang":"en",
                             "value":"CODE"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p3",
                          "label":{
                             "lang":"en",
                             "value":"isMetric"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p5",
                          "label":{
                             "lang":"en",
                             "value":"value"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r47",
                          "type":"skos:Collection",
                          "skos:member":{
                             "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r59"
                          },
                          "prefLabel":{
                             "lang":"en",
                             "value":"si"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r59",
                          "type":[
                             "http://urn.fi/URN:NBN:fi:au:ucum:Unit",
                             "skos:Concept"
                          ],
                          "http://urn.fi/URN:NBN:fi:au:ucum:p1":{
                             "lang":"en",
                             "value":"W"
                          },
                          "http://urn.fi/URN:NBN:fi:au:ucum:p2":{
                             "lang":"en",
                             "value":"W"
                          },
                          "http://urn.fi/URN:NBN:fi:au:ucum:p3":{
                             "lang":"en",
                             "value":"yes"
                          },
                          "http://urn.fi/URN:NBN:fi:au:ucum:p5":{
                             "lang":"en",
                             "value":"1 in J/s"
                          },
                          "broader":{
                             "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r60"
                          },
                          "inScheme":"http://urn.fi/URN:NBN:fi:au:ucum:",
                          "prefLabel":{
                             "lang":"en",
                             "value":"watt"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r60",
                          "type":"skos:Concept",
                          "narrower":{
                             "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r59"
                          },
                          "prefLabel":{
                             "lang":"en",
                             "value":"power"
                          }
                       }
                    ]
                })
            })

        const timeseries = await generateTimeseries( processedData, startTime, endTime ); 
        expect( timeseries ).toHaveProperty( 'watt' );
        expect( timeseries ).toHaveProperty( [ 'watt', 'averages' ] );
        expect( timeseries ).toHaveProperty( [ 'watt', 'observationtimes' ] );
        expect( timeseries[ 'watt' ].observationtimes.length ).toEqual( timeseries[ 'watt' ].averages.length );
        expect( timeseries[ 'watt' ].observationtimes.length ).toEqual( startHours - endHours );
        expect( timeseries[ 'watt' ].averages.length ).toEqual( startHours - endHours );

    } )

} )
