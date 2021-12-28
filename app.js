const express = require( 'express' );
const logger = require( 'morgan' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );

const app = express();
require( 'express-async-errors' );

const indexRouter = require( './routes/index' );
const observationsRouter = require( './routes/observations' );
const featuresRouter = require( './routes/features' );

app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( cors() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );

app.use( '/observationdata', indexRouter );
app.use( '/observationdata/observations', observationsRouter );
app.use( '/observationdata/features', featuresRouter );

module.exports = app;