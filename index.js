const express = require('express');
const app = express();
const hb = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
// const fs = require('fs');

/** MIDDLEWARE BEGIN **/
app.use( cookieSession({ secret: 'verySecretThingsBeHiddenHere..', maxAge: 1000 * 60 * 60 * 24 * 14 }) );   // cookies live max 14 days
app.use( cookieParser() );
app.use( express.static(__dirname + "/public") );
app.use( bodyParser.urlencoded({ extended: false }) );
// Handlebars usage:
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

// Custom middleware example:
app.use(function(req, res, next) {
    console.log('middleware req.url: ', req.url);
    // important to allow the server to continue after the middleware!
    next();
});
/** MIDDLEWARE END **/

/** ROUTES BEGIN: **/
// app.get('/', (req, res) => {
//     // do stuff
//
// })
/** ROUTES END **/

/** INITIALIZE SERVER **/
app.listen(8080, () => console.log("Server listening on port 8080"));
