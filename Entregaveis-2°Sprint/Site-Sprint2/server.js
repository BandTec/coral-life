const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// bodyParser ele converte dados de formulario para Json e etc
app.use(bodyParser.urlencoded({ extended: true }));
// usando o metodo Json
app.use(bodyParser.json());

// Middles
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// rota /api estamos requisitando o nosso arquivo controller que tem o nosso objeto Json Preenchido
app.use('/api', require('./app/controller'));

// estamos configurando o servidor
const server = app.listen(3000);
console.log("Express started at port %s", server.address().port);