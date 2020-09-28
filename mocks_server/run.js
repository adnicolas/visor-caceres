var http = require('http');
var mockserver = require('mockserver');

var server = http.createServer(mockserver('mocks_server/mocks'))
  .listen(9001);

server.on('error', function(e) {
  // Handle your error here
  if (e.code) {

    console.error('Se ha producido un error al crear el servidor: ' + e.code + ' -> ' + e.message);
  } else {
    console.log('Código de error: ' + e.stack);

  }

})
