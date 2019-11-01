const express = require('express');
const http = require('http');
const router = express.Router();

/* GET API Listing */
router.get('*', (req, res) => {
  console.log('GET :: http://localhost:9092/api' + req.url);

  http
    .get('http://localhost:9092/api' + req.url, response => {
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
      console.log('Error :: ' + err.message);
      res.send(err.message);
    });
});

/* POST API */
router.post('*', (req, res) => {
  console.log('POST :: http://localhost:9092/api' + req.url);

  const data = JSON.stringify(req.body);

  const options = {
    hostname: 'localhost',
    port: 9092,
    path: '/api' + req.url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = http.request(options, response => {
    response.on('data', data => {
      res.send(data);
    });
  });

  request.on('error', err => {
    console.log('Error :: ' + err.message);
    res.send(err.message);
  });

  request.write(data);
  request.end();
});

/* PUT API */
router.put('*', (req, res) => {
  console.log('PUT :: http://localhost:9092/api' + req.url);

  const data = JSON.stringify(req.body);

  const options = {
    hostname: 'localhost',
    port: 9092,
    path: '/api' + req.url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = http.request(options, response => {
    response.on('data', data => {
      res.send(data);
    });
  });

  request.on('error', err => {
    console.log('Error :: ' + err.message);
    res.send(err.message);
  });

  request.write(data);
  request.end();
});

/* PATCH API */
router.patch('*', (req, res) => {
  console.log('PUT :: http://localhost:9092/api' + req.url);

  const data = JSON.stringify(req.body);

  const options = {
    hostname: 'localhost',
    port: 9092,
    path: '/api' + req.url,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = http.request(options, response => {
    response.on('data', data => {
      res.send(data);
    });
  });

  request.on('error', err => {
    console.log('Error :: ' + err.message);
    res.send(err.message);
  });

  request.write(data);
  request.end();
});

/* DELETE API */
router.delete('*', (req, res) => {
  console.log('DELETE :: http://localhost:9092/api' + req.url);

  const data = JSON.stringify(req.body);

  const options = {
    hostname: 'localhost',
    port: 9092,
    path: '/api' + req.url,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = http.request(options, response => {
    response.on('data', data => {
      res.send(data);
    });
  });

  request.on('error', err => {
    console.log('Error :: ' + err.message);
    res.send(err.message);
  });

  request.write(data);
  request.end();
});

module.exports = router;
