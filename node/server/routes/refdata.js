const express = require('express');
const http = require('http');
const router = express.Router();

const config = require('../../config');

// const rootUri = 'http://localhost:9091/api';

const rootUri = config.referenceDataWebApi;

/* GET API */
router.get('*', (req, res) => {
  console.log('GET ::', rootUri + req.url);

  http
    .get(rootUri + req.url, response => {
      let data = '';

      // A Chunk of Data has been Recieved
      response.on('data', chunk => {
        data += chunk;
      });

      // The Whole Response has been Received
      response.on('end', () => {
        res.send(data);
      });
    })
    .on('error', err => {
      console.log('Error: ' + err.message);
      res.send(err.message);
    });
});

module.exports = router;
