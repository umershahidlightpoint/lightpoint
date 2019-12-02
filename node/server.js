// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const cors = require('cors');

const config = require('./config');

// Get our API routes
const finance = require('./server/routes/finance');
const refdata = require('./server/routes/refdata');

const app = express();

app.use(cors());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, './dist/AccountApp')));

// Set our api routes
app.use('/finance', finance);
app.use('/refdata', refdata);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/AccountApp/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || config.port;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));