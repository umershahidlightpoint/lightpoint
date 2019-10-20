const express = require('express');
const router = express.Router();
const http = require('http');

/* GET api listing. */
router.get('*', (req, res) => {
  var rootUri = 'http://localhost:9091/api';
  console.log(rootUri + req.url);

  http.get(rootUri + req.url, (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.send(data);
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.send(err.message)
  });

});

module.exports = router;