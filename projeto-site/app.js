process.env.NODE_ENV = 'production';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var leiturasRouter = require('./routes/leituras');
const handlebars = require('express-handlebars')
var sequelize = require('./models').sequelize;
var Evento = require('./models').Evento;
var Usuario = require('./models').Usuario;
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

// cofigurando meus midles
app.use((req, res, next) => {

        console.log("Eu sou um middleware")
        next();
    })
    //rotas

app.get('/relatorio', (req, res) => {
    // quantas são as últimas leituras que quer? 8 está bom?
    res.render('relatorios/relatorio.handlebars')

})

app.post('/relatorio', (req, res) => {
    // quantas são as últimas leituras que quer? 8 está bom?

    console.log(`Recuperando as últimas leituras`);

    const limite_linhas = req.body.limite;

    const instrucaoSql = `select top ${limite_linhas} 
    idEvento,
    estacaoEvento,
    temperaturaEvento, 
    idDomo,
    dataEvento
    from Evento order by idEvento desc`;

    sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
        .then(resultado => {
            res.render('relatorios/relatorio.handlebars', { resultado: resultado })
        }).catch(erro => {
            console.error(erro);
            res.status(500).send(erro.message);
        });

})


app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/leituras', leiturasRouter);

module.exports = app;