let login_usuario;
let nome_usuario;
let token_usuario;
let rua_usuario
let cep_usuario
let complemento_usuario

function redirecionar_login() {
    window.location.href = 'index.html';
}


function verificar_autenticacao() {
    login_usuario = sessionStorage.login_usuario_meuapp;
    nome_usuario = sessionStorage.nome_usuario_meuapp;
    token_usuario = sessionStorage.token_usuario_meuapp;
    rua_usuario = sessionStorage.rua_Usuario_meuapp
    cep_usuario = sessionStorage.cep_Usuario_meuapp
    complemento_usuario = sessionStorage.complemento_Usuario_meuapp



    if (validar_sessao()) {
        redirecionar_login()
    } else {
        if (login_usuario == undefined) {

            redirecionar_login();

        } else {


            b_usuario.innerHTML = nome_usuario;

            if (nome_usuario == undefined || nome_usuario == '') {
                document.getElementById('nomeUsuario').value = 'Preencha este campo'
            }
            if (login_usuario == undefined || login_usuario == '') {
                document.getElementById('emailUsuario').value = 'Preencha este campo'
            }
            if (rua_usuario == undefined || rua_usuario == '') {
                document.getElementById('ruaUsuario').value = 'Preencha este campo'
            }
            if (cep_usuario == undefined || cep_usuario == '' || cep_usuario == null) {
                document.getElementById('cepUsuario').value = ''
            }
            if (complemento_usuario == undefined || complemento_usuario == '') {
                document.getElementById('complementoUsuario').value = 'Preencha este campo'
            }

            document.getElementById('nomeUsuario').value = nome_usuario
            document.getElementById('emailUsuario').value = login_usuario
            document.getElementById('ruaUsuario').value = rua_usuario
            document.getElementById('cepUsuario').value = cep_usuario
            document.getElementById('complementoUsuario').value = complemento_usuario
            document.getElementById('myInput').value = token_usuario
            document.getElementById('tokenoculto').value = token_usuario
            validar_sessao();
        }
    }



}

function logoff() {
    finalizar_sessao();
    sessionStorage.clear();
    redirecionar_login();
}

function validar_sessao() {
    fetch(`/usuarios/sessao/${login_usuario}`, { cache: 'no-store' })
        .then(resposta => {
            if (resposta.ok) {
                resposta.text().then(texto => {
                    console.log('Sessão :) ', texto);
                });
            } else {
                console.error('Sessão :.( ');
                logoff();
            }
        });
}

function finalizar_sessao() {
    fetch(`/usuarios/sair/${login_usuario}`, { cache: 'no-store' });
}
