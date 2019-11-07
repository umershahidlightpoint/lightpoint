const express = require('express');
const router = express.Router();
const http = require('http');
const request = require('request');
const multer = require('multer');
var upload = multer();

const rootUri = 'http://dev11:9092/api';

/* GET API */
router.get('*', (req, res) => {
  console.log('GET ::', rootUri + req.url);

  HttpRequest(req, res, 'GET');
});

/* POST API's */
router.post('*', upload.any(), (req, res) => {
  console.log('POST ::', rootUri + req.url);

  if (req.files) {
    HttpFormDataRequest(req, res);
  } else {
    HttpRequest(req, res, 'POST');
  }
});

/* PUT API's */
router.put('*', (req, res) => {
  console.log('PUT ::', rootUri + req.url);

  HttpRequest(req, res, 'PUT');
});

/* PATCH API's */
router.patch('*', (req, res) => {
  console.log('PATCH ::', rootUri + req.url);

  HttpRequest(req, res, 'PATCH');
});

/* DELETE API's */
router.delete('*', (req, res) => {
  console.log('DELETE ::', rootUri + req.url);

  HttpRequest(req, res, 'DELETE');
});

/* HTTP Request */
HttpRequest = (req, res, method) => {
  const data = JSON.stringify(req.body);

  const options = {
    hostname: 'dev11',
    port: 9092,
    path: '/api' + req.url,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data ? data.length : undefined
    }
  };

  const request = http.request(options, response => {
    let data = '';

    // A Chunk of Data has been Recieved
    response.on('data', chunk => {
      data += chunk;
    });

    // The Whole Response has been Received
    response.on('end', () => {
      res.send(data);
    });
  });

  request.on('error', err => {
    console.log('Error :: ' + err.message);
    res.send(err.message);
  });

  request.write(data);
  request.end();
};

/* HTTP Form Data Request */
HttpFormDataRequest = (req, res) => {
  const formData = {
    files: req.files.map(file => {
      return {
        value: file.buffer,
        options: {
          contentType: file.mimetype,
          filename: file.originalname
        }
      };
    })
  };

  const options = { url: rootUri + req.url, formData: formData };

  request
    .post(options)
    .on('data', data => {
      res.send(data);
    })
    .on('error', err => {
      console.log('Error :: ' + err.message);
      res.send(err.message);
    });
};

module.exports = router;
