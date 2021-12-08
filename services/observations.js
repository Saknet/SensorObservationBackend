const dbService = require( './db' );
const dataProcessingService = require( './dataProcessing' );
const timeseriesService = require( './timeseries' );

async function getMultiple( body ) {
  const gmlid = body.gmlid;
  const startTime = body.start;
  const endTime = body.end;
  const ratu = body.ratu;
  const latitude = body.latitude; 
  const longitude = body.longitude;
  let result = [];
  let observations = [];

  console.log( 'startTime', startTime );
  console.log('endTime ', endTime );

  if ( startTime == null ) {

    startTime = new Date( Date.now() - 3600000 * 8 );

  }

  if ( endTime == null ) {

    endTime = new Date( Date.now() );

  }

  if ( ratu == '56181' || gmlid == 'BID_a03c680b-a156-473d-b210-ae261d808ebf' ) {

//    result = await dbService.queryFVH(
//      "SELECT o.id, o.phenomenontime_begin, o.result, datastream.unitofmeasurement, o.featureofinterest_id FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id is not null AND o.phenomenontime_begin BETWEEN $1 AND $2", 
//      [ startTime, endTime ]
//    );
    result = await dbService.queryFVH(
      "SELECT datastream.unitofmeasurement AS uom, json_agg(json_build_object('time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id is not null AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $1 AND $2 GROUP BY datastream.unitofmeasurement", 
      [ startTime, endTime ]
    );
  }

  if ( !result.length &&  ratu ) {
    result = await dbService.query(
      "SELECT datastream.unitofmeasurement AS uom, json_agg(json_build_object('time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'ratu')::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement", 
      [ ratu, startTime, endTime ]
    );
  }

  if ( !result.length && latitude && longitude  ) {
    result = await dbService.query(
      "SELECT datastream.unitofmeasurement AS uom, json_agg(json_build_object('time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'latitude')::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND (feature->>'longitude')::text = $2 AND o.phenomenontime_begin BETWEEN $3 AND $4 GROUP BY datastream.unitofmeasurement", 
      [ latitude, longitude, startTime, endTime ]
    );
  }

  if ( !result.length && gmlid ) {

    result = await dbService.query(
      "SELECT datastream.unitofmeasurement AS uom, json_agg(json_build_object('time', o.phenomenontime_begin, 'result', o.result)) AS observations FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'gmlid')::text = $1 AND datastream.unitofmeasurement LIKE 'http%' AND o.phenomenontime_begin BETWEEN $2 AND $3 GROUP BY datastream.unitofmeasurement", 
      [ gmlid, startTime, endTime ]
    );

  }

//  console.log( 'result.length', result.length );

  if ( result.length ) {
    
//    let timeserviceStarted = new Date( Date.now() );
    observations = await timeseriesService.generateTimeseries( result, startTime, endTime );
//    console.log( 'timespent timeseries', new Date( Date.now() ) - timeserviceStarted, ' ms' );
 
  } 

  return {
    observations
  }
}

module.exports = {
  getMultiple
}