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

    let firstTime = new Date( startTime ).getTime() / 1000;
    let lastTime = new Date( endTime ).getTime() / 1000;
    let timepoints = [ ];
    const pointone = firstTime + 1800;
    timepoints.push( pointone );

    for ( let i = pointone + 3600; i < lastTime; i += 3600 )  {
        timepoints.push( i );
    } 
    
    return timepoints;

}

/* Function that generates timeseries for specific unit of measurement  */
function generateTimeseriesForUoM( timepoints, observations, unitofmeasurement ) {

    let timevaluepairs = [ ];
    let averages = [ ];
    let observationtimes = [ ];
    let timeseries = { uom: unitofmeasurement, timevaluepairs, averages, observationtimes };

    for ( let i = 0, tl = timepoints.length; i < tl; i++ ) {

        let count = 0;
        let total = 0;

        for ( let j = 0; ol = observations.length, j < ol; j++ ) {

            let phenomenontime_begin = observations[ j ].phenomenontime_begin;

                if ( phenomenontime_begin.getTime() != null && observations[ j ].result != null && Math.abs( timepoints[ i ] - ( phenomenontime_begin.getTime() / 1000 ) ) <= 1800 ) {

                    total += Number( observations[ j ].result );
                    count++;

                }
                
        }

        // Only add to timeseries if there is observation results
        if ( count > 0 ) {

            let time = new Date();
            time.setTime( timepoints[ i ] * 1000 )
            let average = total / count;
            let timevaluepair = { time: timepoints[ i ], totalvalue: total, averagevalue: average, observationscount: count };
            timeseries.timevaluepairs.push( timevaluepair );
            timeseries.averages.push( average );
            timeseries.observationtimes.push( time.toLocaleString( 'fi-FI', { timeZone: 'Europe/Helsinki' } ) );

        }

    }  
    
    return timeseries;
}

  module.exports = {
    generateTimeseries
  }
