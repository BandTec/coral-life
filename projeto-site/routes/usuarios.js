var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Usuario = require('../models').Usuario;

let sessoes = [];

/* Recuperar usuário por login e senha */
router.post('/autenticar', function(req, res, next) {
    console.log('Recuperando usuário por login e senha');

    var login = req.body.login; // depois de .body, use o nome (name) do campo em seu formulário de login
    var senha = req.body.senha; // depois de .body, use o nome (name) do campo em seu formulário de login	

    let instrucaoSql = `select * from Usuario where emailUsuario='${login}' and senhaUsuario='${senha}'`;
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, { model: Usuario }).then(resultado => {
        console.log(`Encontrados: ${resultado.length}`);

        if (resultado.length == 1) {
            console.log(resultado[0].dataValues.nomeUsuario)
            sessoes.push(resultado[0].dataValues.emailUsuario);
            console.log('sessoes: ', sessoes);
            res.json(resultado[0]);
        } else if (resultado.length == 0) {
            res.status(403).send('Login e/ou senha inválido(s)');
        } else {
            res.status(403).send('Mais de um usuário com o mesmo login e senha!');
        }

    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

/* Cadastrar usuário */
router.post('/cadastrar', function(req, res, next) {
    console.log('Criando um usuário');
    let instrucaoSql = `select*from Usuario where emailUsuario='${req.body.email}'`
    sequelize.query(instrucaoSql, { model: Usuario }).then((resultado) => {
        if (resultado.length == 0) {
            var erros = []
            console.log(req.body)
            if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
                erros.push("Nome Invalido")
            }
            if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
                erros.push("Email Invalido")
            }
            if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
                erros.push("Senha Invalida")
            }
            if (req.body.senha.length < 4) {
                erros.push('Senha muito pequena')
            }

            if (req.body.senha != req.body.confirmaSenha) {
                erros.push("As senhas são diferentes")
            }

            if (erros.length > 0) {
                console.log(erros)
                res.status(500).json({ erro: erros })
            } else {
                Usuario.create({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    token: `JKGdnfkie${Math.floor(Math.random() * 50)}sdfge${Math.floor(Math.random() * 1000)}` + Math.floor(Math.random() * 10)
                }).then(cadastro => {
                    console.log(`Registro criado: ${cadastro}`)
                    res.send(cadastro);
                }).catch(erro => {
                    console.error(`Cai aqui ${erro}`);
                    res.status(500).send(erro.message);
                });
            }


        } else {
            console.log('usuario ja existe no banco')
            res.status(500).json({ erro: `Usuario ${resultado[0].dataValues.emailUsuario} já existe no banco de dados` })
        }
    }).catch((err) => {
        console.log('aqui n achei' + err)
        res.status(500).send(err.message)
    })
});

router.post('/recuperarsenha', (req, res, next) => {

    let instrucaoSql = `select * from Usuario where emailUsuario='${req.body.emailUser}' and tokenUsuario='${req.body.tokenUsuario}'`;
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, { model: Usuario }).then(resultado => {
        console.log(`Encontrados: ${resultado.length}`);
        if (resultado.length == 1) {
            if ((resultado[0].dataValues.emailUsuario == req.body.emailUser) && (resultado[0].dataValues.tokenUsuario == req.body.tokenUsuario) && (req.body.senhaNova == req.body.confirmarSenha)) {
                let sqlUpdate = `update Usuario set senhaUsuario='${req.body.senhaNova}' where idUsuario=${resultado[0].dataValues.idUsuario}`
                sequelize.query(sqlUpdate, { model: Usuario }).then(sucesso => {
                    if (sucesso) {
                        console.log('Senha alterada com sucesso')
                        console.log(sucesso[0])
                        res.json(sucesso[0])
                    }
                }).catch((err) => {
                    res.status(500).send(err.message);
                })

            } else {
                res.status(500).send('informações incorretas');
            }
        } else if (resultado.length == 0) {
            res.status(403).send('Não foi possivel achar o usuario');
        } else {
            res.status(403).send('erro');
        }

    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });

})



/* Verificação de usuário */
router.get('/sessao/:login', function(req, res, next) {
    let login = req.params.login;
    console.log(`Verificando se o usuário ${login} tem sessão`);

    let tem_sessao = false;
    for (let u = 0; u < sessoes.length; u++) {
        if (sessoes[u] == login) {
            tem_sessao = true;
            break;
        }
    }

    if (tem_sessao) {
        let mensagem = `Usuário ${login} possui sessão ativa!`;
        console.log(mensagem);
        res.send(mensagem);
    } else {
        res.sendStatus(403);
    }

});


/* Logoff de usuário */
router.get('/sair/:login', function(req, res, next) {
    let login = req.params.login;
    console.log(`Finalizando a sessão do usuário ${login}`);
    let nova_sessoes = []
    for (let u = 0; u < sessoes.length; u++) {
        if (sessoes[u] != login) {
            nova_sessoes.push(sessoes[u]);
        }
    }
    sessoes = nova_sessoes;
    res.send(`Sessão do usuário ${login} finalizada com sucesso!`);
});


/* Recuperar todos os usuários */
router.get('/', function(req, res, next) {
    console.log('Recuperando todos os usuários');
    Usuario.findAndCountAll().then(resultado => {
        console.log(`${resultado.count} registros`);

        res.json(resultado.rows);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

module.exports = router;