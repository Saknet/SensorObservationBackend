const dbService = require('./db');
const helper = require('../helper');
const config = require('../config');
const dataProcessingService = require('./dataProcessing')
const timeseriesService = require('./timeseries')

async function getMultiple( page = 1 ){
  const offset = helper.getOffset( page, config.listPerPage );
  const rows = await dbService.query(
    "SELECT o.id, o.phenomenontime_begin, o.resulttime, o.result, datastream.unitofmeasurement, o.featureofinterest_id FROM observation o INNER JOIN datastream ON o.datastream_id = datastream.id WHERE o.featureofinterest_id is not null OFFSET $1 LIMIT $2", 
    [ offset, config.listPerPage ]
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