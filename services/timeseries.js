const unitofmeasurementService = require('./unitofmeasurement');

/* Function that adds unit of measurement value instead of linkeddata to the data  */
async function addUoM( data ) {

    let dataWithUoM = [];
    
    for ( let i = 0; i < data.length; i++ ) {
        
        data[i].uom =  await unitofmeasurementService.getUoMFromFintoApi( data[i].uom ); 
        dataWithUoM.push(data[i]);           
        
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
    console.log( "timeseries; " + JSON.stringify( timeseries ) );

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
    let timeseries = { uom: unitofmeasurement, timevaluepairs };

    for ( let i = 0; i < timepoints.length; i++ ) {

        let count = 0;
        let total = 0;
        let timepoint = 0;

        for ( let j = 0; j < data.length; j++ ) {

            if ( String( data[ j ].uom ) == unitofmeasurement) {

                let observations = data[ j ].observations;

                for ( let k = 0; k < observations.length; k++ ) {

                    let resulttime = observations[ k ].resulttime;

                    if ( Math.abs( timepoints[ i ] - ( resulttime.getTime() / 1000 ) ) <= 1800 ) {

                        total += Number( observations[ k ].result );
                        count++;
                        timepoint = timepoints[ i ];

                    }
                }
            } 
        }

        let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: total / count };
        timeseries.timevaluepairs.push( timevaluepair );

    }  
    
    return timeseries;
}

  module.exports = {
    generateTimeseries
  }
