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

  if ( startTime == null ) {

    startTime = new Date( Date.now() - 3600000 * 8 );

  }

  if ( endTime == null ) {

    endTime = new Date( Date.now() );

  }

  if ( ratu == '56181' ) {

    result = await dbService.queryFVH(
      "SELECT o.id, o.phenomenontime_begin, o.result, datastream.unitofmeasurement, o.featureofinterest_id FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id is not null AND o.phenomenontime_begin BETWEEN $1 AND $2", 
      [ startTime, endTime ]
    );
  }

  if ( !result.length && gmlid ) {

    result = await dbService.query(
      "SELECT o.id, o.phenomenontime_begin, o.result, datastream.unitofmeasurement FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'gmlid')::text = $1 AND o.phenomenontime_begin BETWEEN $2 AND $3", 
      [ gmlid, startTime, endTime ]
    );

  }

  if ( !result.length &&  ratu ) {
    result = await dbService.query(
      "SELECT o.id, o.phenomenontime_begin, o.result, datastream.unitofmeasurement FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'ratu')::text = $1 AND o.phenomenontime_begin BETWEEN $2 AND $3", 
      [ ratu, startTime, endTime ]
    );
  }

  if ( !result.length && latitude && longitude  ) {
    result = await dbService.query(
      "SELECT o.id, o.phenomenontime_begin, o.result, datastream.unitofmeasurement FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'latitude')::text = $1 AND (feature->>'longitude')::text = $2 AND o.phenomenontime_begin BETWEEN $3 AND $4", 
      [ latitude, longitude, startTime, endTime ]
    );
  }

  if ( result.length ) {

    const processedData = dataProcessingService.preProcessdata( result );
    observations = await timeseriesService.generateTimeseries( processedData, startTime, endTime );

  } 

  return {
    observations
  }
}

module.exports = {
  getMultiple
}