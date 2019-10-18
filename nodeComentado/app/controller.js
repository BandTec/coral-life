const express = require('express');
const { ArduinoData } = require('./serial')
const router = express.Router();


router.get('/', (request, response, next) => {
    // soma e média do vetor Temperatura
    let sum = ArduinoData.List.reduce((a, b) => a + b, 0);
    //Média
    let average = (sum / ArduinoData.List.length).toFixed(2);
    // soma e média
    let sum2 = ArduinoData.List2.reduce((a, b) => a + b, 0);
    let average2 = (sum2 / ArduinoData.List2.length).toFixed(2);

    // aqui estamos criando o nosso objeto Json
    response.json({
        // data1 estamos passando o vetor de temperatura
        data: ArduinoData.List,
        // total1 estamos passando o tamanho total do vetor
        total: ArduinoData.List.length,
        // avarage estamos passando a média mas antes estamos verificando se a média e vazia
        average: isNaN(average) ? 0 : average,

    });

});

// exportando nosssa rota contendo todos os dados necessarios
module.exports = router;