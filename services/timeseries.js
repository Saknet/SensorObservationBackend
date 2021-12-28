const unitofmeasurementService = require( './unitofmeasurement' );

/**
 * Creates the timeseries. First uses unitofmeasurement service to find UoM,
 * then calls generateTimeseriesForUom function to generate timeseries for found uom.
 *
 * @param { object } data data that was retrieved in observation service
 * @param { Array<number> } timepoints timepoints between startTime and endTime in unix time
 * @return { object } timeseries created
 */
async function createTimeseries ( data, timepoints ) {

    let timeseries = [];

    for ( let i = 0, len = data.length; i < len; i++ ) {

        let uom =  await unitofmeasurementService.getUoMFromFintoApi( data[ i ].uom );
        let timeseriesUom = generateTimeseriesForUoM( timepoints, data[ i ].observations, uom, data[ i ].total_sensors );
        timeseries.push( timeseriesUom );

    }

    return timeseries;

}

/**
 * Calls two other functions neeeded for generating observation timeseries for the feature
 *
 * @param { object } data data that was retrieved in observation service
 * @param { date } startTime the start time of observations
 * @param { date } endTime  the end time of observations
 * @return { object } timeseries generated
 */
async function generateTimeseries ( data, startTime, endTime ) {

    const timepoints = generateTimepoints( startTime, endTime );
    const timeseries = await createTimeseries( data, timepoints );

    return timeseries;
}

/**
 * Generates timepoints for every one hour within timeperiod selected by user. For correctness of results,
 * startTime is set in frontend to be 30 mins earlier, and endTime 30 min later (or now) of the selected times!
 *
 * @param { date } startTime the start time of observations
 * @param { date } endTime  the end time of observations
 * @return { Array<number> } generated timepoints between startTime and endTime in unix time
 */
function generateTimepoints ( startTime, endTime  ) {

    let firstTime = new Date( startTime ).getTime();
    let lastTime = new Date( endTime ).getTime();
    let timepoints = [ ];

    const pointone = firstTime + 1800000;
    timepoints.push( pointone );

    for ( let i = pointone + 3600000; i <= lastTime; i += 3600000 )  {
        timepoints.push( i );
    }

    return timepoints;

}

/**
 * Generates timeseries for specific unit of measurement. Observation results for each timepoint are counted in reverse while.
 * After counting is completed addDataToTimeseries function is called to write timeseries.
 *
 * @param { Array<number> } timepoints in unix time
 * @param { object } observations observation times and results
 * @param { string } unitofmeasurement uom of observations
 * @return { object } timeseries with results written
 */
function generateTimeseriesForUoM ( timepoints, observations, unitofmeasurement, total_sensors ) {

    const timeValuePairs = new Map();
    let i = timepoints.length;

    while ( i-- ) {

        const observationResults = countObservationResults( observations, timepoints[ i ] );

        if ( observationResults[ 0 ] > 0 ) {

            timeValuePairs.set( timepoints[ i ], observationResults );

        }

    }

    let timeseries = { uom: unitofmeasurement, averages: [], observationtimes: [], sensorcount:  total_sensors };
    addDataToTimeseries( timeValuePairs, timepoints, timeseries );

    return timeseries;

}

/**
 * Counts observation results. If observation's time is within half hour of timepoint it is added to results and observation is removed from list
 * Reverse while is used to increase peformance with larger datasets.
 *
 * @param { object } observations observation times and results
 * @param { number } time point of time in unix time
 * @return { Array<number> } returns two values, count and total of observations within 30mins of unix time point
 */
function countObservationResults ( observations, time ) {

    let count = 0;
    let total = 0;
    let i = observations.length;

    while ( i-- ) {

        if ( Math.abs( time - ( Date.parse( observations[ i ].time ) ) ) <= 1800000 ) {

            total += Number( observations[ i ].result );
            count++;
            observations.splice( i, 1 );

        }

    }

    return [ count, total ];

}

/**
 * Checks if there is observation results found for each timepoint, if results are found it writes observation results to timeseries.
 * Averages for each hour of uom are written.
 *
 * @param { Map<number, Array<number>> } timeValuePairs map containg observation result time-value pairs and count of observations
 * @param { Array<number> } timepoints generated timepoints between startTime and endTime in unix time
 * @param { object } timeseries where averages are written to
 */
function addDataToTimeseries ( timeValuePairs, timepoints, timeseries ) {

    for ( let i = 0, len = timepoints.length; i < len; i++ ) {

        let value = timeValuePairs.get( timepoints[ i ] );

        if ( value ) {

            let time = new Date( timepoints[ i ] );
            timeseries.averages.push( value[ 1 ] / value[ 0 ] );
            timeseries.observationtimes.push( time.toLocaleString( 'fi-FI', { timeZone: 'Europe/Helsinki' } ) );

        }

    }

}

module.exports = {
    generateTimeseries,
    generateTimepoints,
    generateTimeseriesForUoM,
    addDataToTimeseries,
    countObservationResults
};
