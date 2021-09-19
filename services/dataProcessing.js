
/* Function that processes queried data for faster timeseries generation  */
function preProcessdata( data ) {

    let processedData = []; 
    let uomLinkList = [];

    for ( let i = 0; i < data.length; i++ ) {

        //check if there is linked uom data on row that has observation time and value
        if ( String( data[ i ].unitofmeasurement ).startsWith( 'http' ) && data[ i ].phenomenontime_begin != null && data[ i ].result != null ) {

            let uomLink = data[ i ].unitofmeasurement;

            //if uom already exists in the previously prossed data add the observation data under it
            if ( uomLinkList.includes( uomLink ) ) {

                for ( let j = 0; j < processedData.length; j++ ) {

                    if ( processedData[ j ].uom == uomLink ) {

                        let observationsData = [ ...processedData[ j ].observations ];
                        observationsData.push( data[ i ] );
                        let row = { uom: uomLink, observations: observationsData };
                        processedData[ j ] = row;

                    }

                }

            } else {

                let observationsData = [];
                observationsData.push( data[ i ] );
                let row = { uom: uomLink, observations: observationsData };
                processedData.push( row );
                uomLinkList.push( uomLink );

            }
            
        }
    } 

    return processedData;
}

module.exports = {
    preProcessdata
}