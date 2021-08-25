const dbService = require( './db' );
const helper = require( '../helper');
const config = require( '../config' );
const dataProcessingService = require( './dataProcessing' );
const timeseriesService = require( './timeseries' );

async function getMultiple( page = 1, body ) {

  const offset = helper.getOffset( page, config.listPerPage );
  const startTime = body.start;
  const endTime = body.end;
  console.log("body", body );
  console.log("times", startTime );
  console.log("times", endTime );

  const rows = await dbService.query(
    "SELECT o.id, o.phenomenontime_begin, o.resulttime, o.result, datastream.unitofmeasurement, o.featureofinterest_id FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id is not null AND o.resulttime BETWEEN $3 AND $4 OFFSET $1 LIMIT $2", 
    [ offset, config.listPerPage, body.start, body.end ]
  );
  
  const data = helper.emptyOrRows( rows );;
  const processedData = dataProcessingService.preProcessdata( data );
  const observations = await timeseriesService.generateTimeseries( processedData );
  const meta = { page };

  return {
    observations
  }
}

module.exports = {
  getMultiple
}