const { generateTimepoints, countObservationResults, addDataToTimeseries } = require('../services/timeseries');
const defaultStartTime = new Date( Date.now() - 3600000 * 8 );
const defaultEndTime = new Date( Date.now() );

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

    test( 'Default values', async () => {
        expect( defaultTimepoints ).toHaveLength( 8 )
        expect( defaultTimepoints ).toContain( new Date( defaultStartTime ).getTime() / 1000 + 1800 )
        expect( defaultTimepoints ).toContain( new Date( defaultStartTime ).getTime() / 1000 + 1800 + 3600 * 5 )
    } )

    test( 'Random values', async () => {
        expect( timepoints ).toHaveLength( startHours - endHours )
        expect( timepoints ).toContain( new Date( startTime ).getTime() / 1000 + 1800 + 3600 * 2 )
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

    test( 'With random dates', async () => {
        const timeseries = addDataToTimeseries( timepoints[ index ], { uom: 'joule', timevaluepairs: [], averages: [], observationtimes: [] }, 5555, 4 );
        expect( timeseries ).toHaveProperty( 'averages', [1388.75] )
        expect( timeseries ).toHaveProperty( 'uom', 'joule' )
        expect( timeseries ).toHaveProperty( 'timevaluepairs', [{"averagevalue": 1388.75, "observationscount": 4, "time": timepoints[ index ], "totalvalue": 5555}] )
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

    test( 'With random dates and data', async () => {

        for ( let i = 0, len = timepoints.length; i < len; i++ ) {
            let value = Math.floor( Math.random() * 1000 );
            let generateddata = generateObservationDataForDates( timepoints[ i ], value );
            let results = countObservationResults( generateddata[ 0 ], timepoints[ i ] );
            expect( results ).toContain( value )
            expect( results ).toContain( generateddata[ 1 ] )
        }

    } )

} )

function generateObservationDataForDates( timepoint, n ) {
    let observations = []; 
    let total = 0;

    for ( let i = 0, len = n; i < len; i++ ) {
        let generated = -1800 + Math.floor( Math.random() * 3601 );
        let value = Math.floor( Math.random() * 100 );
        let time = new Date( ( timepoint + generated ) * 1000 );
        observationsData = { phenomenontime_begin: time, result: value }
        observations.push( observationsData );
        total += value;

    }

    return [ observations, total ];

}
