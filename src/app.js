const rfs = require( 'rotating-file-stream' ); //version 2.x
const session = require( 'express-session' );
const passport = require( 'passport' );
const express = require( 'express' ); // Framework
const morgan = require( 'morgan' );   // Show browser requests
const loggerHandler = require('./log/facadeLogger');
const httpContext = require('express-http-context');
const cors = require( 'cors' );

require( './config/passport' );
const app = express( );

// Settings
app.set( 'port', process.env.PORT || 3000 );

// Middleware
app.use(morgan('combined', {
    "stream": loggerHandler.fileStream
}));

app.use(morgan('dev'));

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}) );
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin,\
    X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use( express.json() );
app.use( session({
    secret: 'IngenioUN',
    resave: true,
    saveUninitialized: true
}));
app.use( passport.initialize( ) );
app.use( passport.session( ) );

// Routes

app.use( '/session', require( './routes/session' ) );
app.use( '/user', require( './routes/user' ) );
app.use( '/author-request', require( './routes/authorRequest' ) );
app.use( '/publication', require( './routes/publication' ) );
app.use( '/category', require( './routes/category' ) );
app.use( '/notification', require( './routes/notification' ) );

// Juan

// Valeria

// Carlos

// Tatiana

module.exports = app;
