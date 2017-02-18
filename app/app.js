const https = require('https');
const http = require('http');
const trick = require('../');
const querystring = require('querystring');
const path = require('path');

function get(url, httpObj) {
  return new Promise((resolve, reject) => {
    console.log(url);
    httpObj.get(url, (res) => {
      const statusCode = res.statusCode;
      console.log(statusCode);
      if (statusCode !== 200 && statusCode !== 302) {
         reject({message: 'invalid url'});
      }
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve(data)
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
};

const server = http.createServer((req, res) => {
  let query = require('url').parse(req.url, true).query;
  if (query.q === 'data') {
    let message;
    let address = query.address;
    let httpObj = http;
    if(/github/.test(address)){
      address = address.replace(/\/\/github/, '//raw.githubusercontent').replace(/\/blob/, '');
      httpObj = https;
    }else if(/gitlab/.test(address)){
      address = address.replace(/\/blob/, '/raw');
    }
    let code = get(address, httpObj).then(data => {
      message = trick(data)
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        message: message[0],
        img: message[1]
      }));
    }).catch(e => {
      res.end(JSON.stringify({message: e.message}));
    });

  } else {
    res.statusCode = 200;
    res.end(require('fs').readFileSync(path.join(__dirname, 'index.html')));
  }
});

server.listen(3000, () => {
  console.log(`Server running at 3000`);
});