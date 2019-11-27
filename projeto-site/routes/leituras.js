var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Evento = require('../models').Evento;

/* Recuperar as últimas N leituras */
router.get('/ultimas', function(req, res, next) {

    // quantas são as últimas leituras que quer? 8 está bom?
    const limite_linhas = 10;

    console.log(`Recuperando as últimas ${limite_linhas} leituras`);

    const instrucaoSql = `select top ${limite_linhas} 
						dataEvento, 
						temperaturaEvento, 
						idDomo,
						FORMAT(dataEvento,'HH:mm:ss')
						from Evento order by idEvento desc`;

    sequelize.query(instrucaoSql, { model: Evento }).then(resultado => {

        console.log(`Encontrados: ${resultado.length}`);
        res.json(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});


// tempo real (último valor de cada leitura)
router.get('/tempo-real', function(req, res, next) {

    console.log(`Recuperando as últimas leituras`);

    const instrucaoSql = `select top 1 temperaturaEvento from Evento order by idEvento desc`;

    sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
        .then(resultado => {
            res.json(resultado[0]);
        }).catch(erro => {
            console.error(erro);
            res.status(500).send(erro.message);
        });

});


router.get('/media', (req, res, next) => {
    console.log(`Recuperando as estatísticas atuais`);

    const instrucaoSql = `select avg(temperaturaEvento) as Media
						from Evento`;
    sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
        .then(resultado => {
            console.log(resultado.length)
            res.json(resultado[0]);
        }).catch(erro => {
            console.error(erro);
            res.status(500).send(erro.message);
        });
})

// estatísticas (max, min, média, mediana, quartis etc)
router.get('/estatisticas', function(req, res, next) {

    console.log(`Recuperando as estatísticas atuais`);

    const instrucaoSql = `select 
							max(temperatura) as temp_maxima, 
							min(temperatura) as temp_minima, 
							avg(temperatura) as temp_media,
							max(umidade) as umidade_maxima, 
							min(umidade) as umidade_minima, 
							avg(umidade) as umidade_media 
						from leitura`;

    sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
        .then(resultado => {
            res.json(resultado[0]);
        }).catch(erro => {
            console.error(erro);
            res.status(500).send(erro.message);
        });

});


module.exports = router;