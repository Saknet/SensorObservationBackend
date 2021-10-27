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

function generateTestData( startTime, n, hours, uomlist ) {
    let observations = [];

    for ( let i = 0, len = n; i < len; i++ ) {
        let generated = Math.floor( Math.random() * uomlist.length );
        let unitofmeasurement = uomlist[ generated ];
        let result = Math.floor( Math.random() * 501 );
        let randomTime = Math.floor( Math.random() * 3600000 * hours );
        let phenomenontime_begin = new Date(  startTime  + randomTime );
        let row = { unitofmeasurement: unitofmeasurement, phenomenontime_begin: phenomenontime_begin, result: result }
        observations.push( row );
    }

    return observations;

}

module.exports = {
    generateTestData,
    generateObservationDataForDates
};