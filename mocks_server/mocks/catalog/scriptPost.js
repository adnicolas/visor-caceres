//Ejemplo de proceso de respuesta procesando el json de entrada
console.log(request.body);
var response = JSON.parse(request.body);
response.id = Math.floor((Math.random() * 1000) + 1);
module.exports = response;
