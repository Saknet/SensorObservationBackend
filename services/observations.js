const dbService = require( './db' );
const helper = require( '../helper');
const config = require( '../config' );
const dataProcessingService = require( './dataProcessing' );
const timeseriesService = require( './timeseries' );

async function getMultiple( page = 1, body ) {

  const offset = helper.getOffset( page, config.listPerPage );
  let gmlid = body.gmlid;
  let startTime = body.start;
  let endTime = body.end;

  if ( startTime == null ) {

    startTime = new Date( Date.now() - 3600000 * 4 );

  }

  if ( endTime == null ) {

    endTime = new Date( Date.now() );

  }

  // for testing only remove in production
  if ( gmlid == null ) {

    gmlid = 'BID_4f77b0c3-812f-470b-b305-7c4807e2934f';

  }

  const rows = await dbService.query(
    "SELECT o.id, o.phenomenontime_begin, o.result, datastream.unitofmeasurement FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id INNER JOIN featureofinterest ON o.featureofinterest_id = featureofinterest.id WHERE (feature->>'gmlid')::text = $1 AND o.phenomenontime_begin BETWEEN $2 AND $3", 
    [ gmlid, startTime, endTime ]
  );

  let observations = [];
  const data = helper.emptyOrRows( rows );

  if ( data.length > 0 ) {

    const processedData = dataProcessingService.preProcessdata( data );
    observations = await timeseriesService.generateTimeseries( processedData, startTime, endTime );

  }

  return {
    observations
  }
}

module.exports = {
  getMultiple
}