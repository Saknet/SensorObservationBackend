const router = require( 'express' ).Router();
const features = require( '../services/features' );

router.get( '/', async function( req, res, next ) {
  try {

    res.json( await features.getMultiple( ) );

  } catch ( err ) {

    console.error( `Error while getting features`, err.message );
    next( err );

  }
});

module.exports = router;