const express = require( 'express' );
const logger = require( 'morgan' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );

const app = express();

const indexRouter = require( './routes/index' );
const observationsRouter = require( './routes/observations' );
const featuresRouter = require( './routes/features' );

app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( cors() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );

app.use( '/', indexRouter );
app.use( '/observations', observationsRouter );
app.use( '/features', featuresRouter );

module.exports = app;