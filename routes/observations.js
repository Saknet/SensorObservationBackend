const router = require( 'express' ).Router();
const observations = require( '../services/observations' );

router.post( '/', async function( req, res, next ) {
  try {
    console.log("request params", req.body )
    res.json( await observations.getMultiple( req.query.page, req.body ) );
  } catch ( err ) {
    console.error( `Error while getting observations`, err.message );
    next( err );
  }
});

module.exports = router;