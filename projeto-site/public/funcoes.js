let login_usuario;
let nome_usuario;
let token_usuario;

function redirecionar_login() {
    window.location.href = 'inicio.html';
}



function verificar_autenticacao() {
    login_usuario = sessionStorage.login_usuario_meuapp;
    nome_usuario = sessionStorage.nome_usuario_meuapp;
    token_usuario = sessionStorage.token_usuario_meuapp;

    if (validar_sessao()) {
        redirecionar_login()
    } else {
        if (login_usuario == undefined) {

            redirecionar_login();

        } else {
            b_usuario.innerHTML = nome_usuario;
            token_user.innerHTML = token_usuario;
            iduser.innerHTML = id_Usuario
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