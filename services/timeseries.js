const unitofmeasurementService = require('./unitofmeasurement');

/* Function that adds unit of measurement value instead of linkeddata to the data  */
async function addUoM( data ) {

    let dataWithUoM = [];

    for ( let i = 0, len = data.length; i < len; i++ ) {

        data[ i ].uom =  await unitofmeasurementService.getUoMFromFintoApi( data[ i ].uom );
        dataWithUoM.push( data[ i ] ); 

    } 

    return dataWithUoM;

}

/* Function that calls other functions to generate a timeseries for the feature  */
async function generateTimeseries( data, startTime, endTime ) {

    const dataWithUoM = await addUoM( data );
    const timepoints = generateTimepoints( startTime, endTime );

    let timeseries = new Object();
    timeseries.w = generateTimeseriesForUoM( timepoints, dataWithUoM, 'watt') ;
    timeseries.v = generateTimeseriesForUoM( timepoints, dataWithUoM, 'volt' );
    timeseries.j = generateTimeseriesForUoM( timepoints, dataWithUoM, 'joule' );
    timeseries.a = generateTimeseriesForUoM( timepoints, dataWithUoM, 'ampère' );
    timeseries.decibel = generateTimeseriesForUoM( timepoints, dataWithUoM, 'bel sound pressure' );
    timeseries.degreeCelsius = generateTimeseriesForUoM( timepoints, dataWithUoM, 'degree Celsius' );
    timeseries.pm = generateTimeseriesForUoM( timepoints, dataWithUoM, 'particulate matter' );

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
function generateTimeseriesForUoM( timepoints, data, unitofmeasurement ) {

    let timevaluepairs = [ ];
    let averages = [ ];
    let observationtimes = [ ];
    let timeseries = { uom: unitofmeasurement, timevaluepairs, averages, observationtimes };

    for ( let i = 0, tl = timepoints.length; i < tl; i++ ) {

        let count = 0;
        let total = 0;

        for ( let j = 0, dl = data.length; dl; j++ ) {

            if ( String( data[ j ].uom ) == unitofmeasurement) {

                let observations = data[ j ].observations;

                for ( let k = 0; ol = observations.length, k < ol; k++ ) {

                    let phenomenontime_begin = observations[ k ].phenomenontime_begin;

                    if ( phenomenontime_begin.getTime() != null && observations[ k ].result != null && Math.abs( timepoints[ i ] - ( phenomenontime_begin.getTime() / 1000 ) ) <= 1800 ) {

                        total += Number( observations[ k ].result );
                        count++;

                    }
                }
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
