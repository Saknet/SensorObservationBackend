const unitofmeasurementService = require('./unitofmeasurement');

/* Function that adds unit of measurement value instead of linkeddata to the data  */
async function addUoM( data, timepoints ) {

    let timeseries = new Object();

    for ( let i = 0, len = data.length; i < len; i++ ) {

        let uom =  await unitofmeasurementService.getUoMFromFintoApi( data[ i ].uom );
        timeseries[ uom ] = generateTimeseriesForUoM( timepoints, data[ i ].observations, uom );

    } 

    return timeseries;

}

/* Function that calls other functions to generate a timeseries for the feature  */
async function generateTimeseries( data, startTime, endTime ) {

    const timepoints = generateTimepoints( startTime, endTime );
    const timeseries = await addUoM( data, timepoints );

    return timeseries;
}

/* Function that generates timepoints for every one hour */
function generateTimepoints( startTime, endTime  ) {

    let firstTime = new Date( startTime ).getTime();
    let lastTime = new Date( endTime ).getTime();
    let timepoints = [ ];

    const pointone = firstTime + 1800000;
    timepoints.push( pointone );

    for ( let i = pointone + 3600000; i < lastTime; i += 3600000 )  {
        timepoints.push( i );
    } 
    
    return timepoints;

}

/* Function that generates timeseries for specific unit of measurement  */
function generateTimeseriesForUoM( timepoints, observations, unitofmeasurement ) {

    const timeValuePairs = new Map();
    let i = timepoints.length;

    while ( i-- ) {

        const observationResults = countObservationResults( observations, timepoints[ i ] );

        // Only add to timeseries if there is observation results
        if ( observationResults[ 0 ] > 0 ) {

            timeValuePairs.set( timepoints[ i ], observationResults );

        }

    }

    let timeseries = { uom: unitofmeasurement, averages: [], observationtimes: [] };
    addDataToTimeseries( timeValuePairs, timepoints, timeseries );
/* 
    for ( let i = 0, tl = timepoints.length; i < tl; i++ ) {

        const observationResults = countObservationResults( observations, timepoints[ i ] );
        const count = observationResults[ 0 ];
        const total = observationResults[ 1 ];

        // Only add to timeseries if there is observation results
        if ( count > 0 ) {

            timeseries = addDataToTimeseries( timepoints[ i ], timeseries, total, count );

        }

    } */  
    
    return timeseries;

}

/* Function that counts observation results */
function countObservationResults( observations, time ) {

    let count = 0;
    let total = 0;

/*     for ( let i = 0, ol = observations.length; i < ol; i++ ) {

        let phenomenontime_begin = new Date( observations[ i ].phenomenontime_begin );

            if ( phenomenontime_begin.getTime() != null && observations[ i ].result != null && Math.abs( time - ( phenomenontime_begin.getTime() / 1000 ) ) <= 1800 ) {

                total += Number( observations[ i ].result );
                count++;

            }
            
    }
 */
    let i = observations.length;
    while ( i-- ) {

        if ( observations[ i ].result != null && Math.abs( time - ( new Date( observations[ i ].time ).getTime() ) ) <= 1800000 ) {

            total += Number( observations[ i ].result );
            count++;
            observations.splice( i, 1 ); 

        }

    }

    return [ count, total ];

}

/* Function that adds observation data to timeseries */
function addDataToTimeseries( timeValuePairs, timepoints, timeseries ) {

    for ( let i = 0, len = timepoints.length; i < len; i++ ) {

        let value = timeValuePairs.get( timepoints[ i ] );

        if ( value ) {

            let time = new Date( timepoints[ i ] );
            let average = value[ 1 ] / value[ 0 ];
            timeseries.averages.push( average );
            timeseries.observationtimes.push( time.toLocaleString( 'fi-FI', { timeZone: 'Europe/Helsinki' } ) );

        }

    }

    //    let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: average, observationscount: count };
    //    timeseries.timevaluepairs.push( timevaluepair );

    return timeseries;

}

module.exports = {
    generateTimeseries,
    generateTimepoints,
    generateTimeseriesForUoM,
    addDataToTimeseries,
    countObservationResults
}
