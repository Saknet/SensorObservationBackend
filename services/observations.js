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

        const latmax = (latitude + 0.0004).toString();
        const latmin = (latitude  - 0.0004).toString();
        const longmax = (longitude + 0.0004).toString();
        const longmin = (longitude  - 0.0004).toString(); 
            
        const bbox = 'POLYGON((' + longmin + ' ' + latmin + ', ' + longmin + ' ' + latmax + ', ' + longmax + ' ' + latmax + ', ' + longmax + ' ' + latmin + ', ' + longmin + ' ' + latmin + '))';

        const features = await dbService.query(
            "SELECT id, ST_AsGeoJSON(feature) as feature FROM featureofinterest WHERE ST_Within(feature, ST_GeomFromText($1, 4326) ) ",
            [ bbox ]
        );

        if ( features.length ) {

            const featureId = findClosestFeature( latitude, longitude, features ); 

            result = await dbService.query(
                "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement",
                [ featureId, startTime, endTime ]
            );
        } 

    }

    if ( !result.length &&  ratu ) {

        result = await dbService.query(
            "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE ( properties->>'ratu' )::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement",
            [ ratu, startTime, endTime ]
        );

    }

    if ( !result.length && gmlid ) {

        result = await dbService.query(
            "SELECT datastream.unitofmeasurement AS uom, COUNT ( DISTINCT datastream.sensor_id ) AS total_sensors, json_agg( json_build_object( 'time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE ( properties->>'gmlid' )::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement",
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

        const feature_lat = features[ i ]['feature'].substring(41, 50);
        const feature_long = features[ i ]['feature'].substring(31, 40);

        let distance = getDistance( longitude, latitude, Number(feature_long), Number(feature_lat) );
        
        if ( distance < closestDistance ) {
            closestDistance = distance;
            closestId = features[ i ][ 'id' ];
        }
    }

    return closestId;
}

function getDistance( x1, y1, x2, y2 ){
    const y = x2 - x1;
    const x = y2 - y1;
    
    return Math.sqrt( x * x + y * y );
}

module.exports = {
    getMultiple
};