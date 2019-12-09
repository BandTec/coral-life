var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Evento = require('../models').Evento;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('inicio', { title: 'Express' });
});


module.exports = router;