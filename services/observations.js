const dbService = require( './db' );
const timeseriesService = require( './timeseries' );

/**
 * Retrives observation data matching the parameters found in the request body from a database
 * and calls timeseries service to create timeseries for the found data.
 *
 * @param { object } body of a request from frontend
 * @return { object } timeseries generated
 */
async function getMultiple ( body ) {
    const gmlid = body.gmlid;
    let startTime = body.start;
    let endTime = body.end;
    const ratu = body.ratu;
    const latitude = body.latitude;
    const longitude = body.longitude;
    let result = [];
    let observations = [];

    if ( !startTime ) {

        startTime = new Date( Date.now() - 3600000 * 8 - 1800000 );

    }

    if ( !endTime ) {

        endTime = new Date( Date.now() );

    }

    if ( ratu === '56181' || gmlid === 'BID_a03c680b-a156-473d-b210-ae261d808ebf' ) {

        result = await dbService.queryFVH(
            "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.description ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result )) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id is not null AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $1 AND $2 GROUP BY datastream.unitofmeasurement",
            [ startTime, endTime ]
        );

    }

    if ( !result.length && latitude && longitude ) {

        const latmax = latitude + 0.0004;
        const latmin = latitude  - 0.0004;
        const longmax = longitude + 0.0004;
        const longmin = longitude  - 0.0004;

        const features = await dbService.query(
            "SELECT * FROM featureofinterest WHERE (CAST ( feature #>>'{coordinates,0}' AS numeric ) BETWEEN $1 AND $2) AND (CAST ( feature #>>'{coordinates,1}' AS numeric )BETWEEN $3 AND $4)",
            [ latmin, latmax, longmin, longmax ]
        );

        console.log('features', features );

        if ( features.length ) {

            let featureId = findClosestFeature( latitude, longitude, features ); 
            console.log('featureId', featureId );
            result = await dbService.query(
                "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement",
                [ featureId, startTime, endTime ]
            );
        } 

    }

    if ( !result.length && latitude && longitude  ) {

        result = await dbService.query(
            "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE ( feature->>'latitude' )::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND ( feature->>'longitude' )::text = $2 AND o.phenomenontime_begin BETWEEN $3 AND $4 GROUP BY datastream.unitofmeasurement",
            [ latitude, longitude, startTime, endTime ]
        );

    }

    if ( !result.length &&  ratu ) {

        result = await dbService.query(
            "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE ( feature->>'ratu' )::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement",
            [ ratu, startTime, endTime ]
        );

    }

    if ( !result.length && gmlid ) {

        result = await dbService.query(
            "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE ( feature->>'gmlid' )::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement",
            [ gmlid, startTime, endTime ]
        );

    }

    if ( result.length ) {

        observations = await timeseriesService.generateTimeseries( result, startTime, endTime );

    }

    return {
        observations
    };
}

function findClosestFeature( latitude, longitude, features ) {

    let closestDistance = 9999999999; 
    let closestId;

    for ( let i = 0, len = features.length; i < len; i++ ) {

        let distance = getDistance( latitude, longitude, features[ i ][ 'feature' ][ 'coordinates' ][ 0 ], features[ i ][ 'feature' ][ 'coordinates' ][ 1 ] );
        
        if ( distance < closestDistance ) {
            closestDistance = distance;
            closestId = features[ 'id' ];
        }
    }

    return closestId;
}

function getDistance( x1, y1, x2, y2 ){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt( x * x + y * y );
}

module.exports = {
    getMultiple
};