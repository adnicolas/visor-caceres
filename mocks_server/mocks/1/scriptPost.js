//Ejemplo de proceso de respuesta procesando el json de entrada
console.log(request.body);
var response = JSON.parse(request.body);
module.exports = response;
