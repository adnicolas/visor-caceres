// para el correcto funcionamiento de la aplicacion, esta se debe ejecutar en la misma diorección IP que el proxy
var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';// NO USAR LOCALHOST
var port = process.env.PORT || 8123;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // permite todos los orígenes
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders : {
      "x-powered-by": "CORS Anywhere",
    },
   redirectSameOrigin:true, // las peticiones desde el mismo origen no pasan por proxy , se redireccionan
    httpProxyOptions:{
      secure:false
    }

}).listen(port, host, function() {
    console.log('Ejecutando proxy en ' + host + ':' + port);
    });
