'use strict';
const http = require('http');
const qs = require('querystring');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      const fs = require('fs');
      const rs = fs.createReadStream('./form.html');
      rs.pipe(res);
      break;
    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(rawData);
        const answer = qs.parse(decoded);
        const text = answer['name'] + "さんは" + answer['yaki-shabu'] + "に投稿しました";
        console.info('[' + now + '] 投稿: ' + text);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          text + '</h1></body></html>');
        res.end();
      });
      break;
    default:
      break;
  }
}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});