// var sftp = require('node-sftp-deploy-i');
Sftp = require('@juancarlosrmr/node-sftp-deploy-sp');
var config = {
  host: "geospatialsaitest.grupotecopy.es",
  port: "22",
  user: "root",
  pass: "test--Cot",
  remotePath: "/var/nodejs/mocks_server/mocks",
  sourcePath: "./mocks_server/mocks",
  silent: true
};

printConfig();

console.group();
console.log("🚀 INICIANDO SUBIDA DE MOCKS");
console.log("------------------------");
console.log('Desplegando de ' + config.sourcePath + ' a sftp://' + config.host + ':' + config.port + config.remotePath)

var sftp = new Sftp()

sftp.on('file_upload', (upload) => {
  console.info(' 📄   ' + upload.file + ' -> 📂   ' + upload.remote)
})

sftp.upload(config)
  .then(data => ftpDeployOK(data))
  .catch(err => ftpDeployKO(err));

function ftpDeployOK(data) {
  console.group();
  console.log('--------------------'); // same data as uploading event
  console.log('✅ - SUBIDA FINALIZADA'); // same data as uploading event
  console.log('--------------------'); // same data as uploading event
  console.groupEnd
};

function ftpDeployKO(err) {
  console.group();
  console.log('❌ ERROR !!!'); // same data as uploading event
  console.log('------------'); // same data as uploading event
  console.log(err); // data will also include filename, relativePath, and other goodies
  console.groupEnd

}

function printConfig() {
  console.group();
  console.log("📃 CONFIGURACION DEL DESPLIEGUE");
  console.log("-------------------------------");
  console.group();
  console.log('user: ' + config.user);
  console.log('password: ' + config.pass);
  console.log('host: ' + config.host);
  console.log('port: ' + config.port);
  console.log('localRoot: ' + config.sourcePath);
  console.log('remoteRoot: ' + config.remotePath);
  console.groupEnd();
  console.log("-------------------------------");
  console.groupEnd();
  console.log("");

}
