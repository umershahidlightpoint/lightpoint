const express = require('express');
const router = express.Router();
const http = require('http');

/* GET api listing. */
router.get('*', (req, res) => {
  console.log('http://localhost:9092/api' + req.url);

  http.get('http://localhost:9092/api' + req.url, (resp) => {
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