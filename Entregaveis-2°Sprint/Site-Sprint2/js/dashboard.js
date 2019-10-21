function grafico() {
    // criando uma variavel context que ira receber o elemento chart
    var context = document.getElementById("chart").getContext("2d");
    context.canvas.width = 1000;
    // setando uma largura para o grafico
    context.canvas.height = 300;
    // setando uma altura para o grafico
    ///    var contador = 0;

    //var years = [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050];
    //var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // nossa variavel de configuração do grafico
    var configuration = {
        type: 'line',
        // grafico do tipo de linha
        // data ira fazer nossa estrutura do grafico
        data: {
            // labels: years,
            datasets: [{
                //nossa legenda do grafico
                label: "Temperatura",
                type: 'line',
                //setando um cor na borda da linha
                borderColor: "#3e95cd",
                // o tamanho da borda
                borderWidth: 3,
                // fill false nos setamos sem fundo o nosso grafico
                fill: false,
                // a cor da nossa linha 
                backgroundColor: [
                    'rgba(47,54,64, 0.2)'
                ],
            }],

        },
        // opções que ira conter no nosso grafico
        options: {
            // é index da linha ou seja criará um ponto onde foi armazenado os dados no grafico
            tooltips: {
                // do tipo ponto
                mode: 'point'
            },
            scales: {
                xAxes: [{
                    //type: 'value',
                    distribution: 'series',
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{

                    scaleLabel: {
                        display: true,
                        labelString: 'Temperatura'
                    },
                    ticks: {
                        beginAtZero: true
                    }

                }]
            },
            animation: {
                duration: 0
            }
        }
    };

    // criando uma variavel chart para utilizarmos futuramente
    var chart = new Chart(context, configuration);

    //Função para obter os dados de temperatura do server
    //Seria mais interessante fazer isso com WebSocket, porém para fins academicos, os dados serão atualizados via HTTP

    //Esse atributo dentro do contexto serve para saber qual foi o último índice processado, assim eliminado os outros elementos na
    //hora de montar/atualizar o gráfico
    this.lastIndexTemp = 0;
    this.time = 0;

    // criando uma função para preencher nosso grafico
    function get_data() {
        // estamos criando uma varivel para acessar nosso servidor local
        var http = new XMLHttpRequest();
        // estamos pegando todos os dados que esta vindo do servidor
        http.open('GET', 'http://localhost:3000/api', false);
        http.send(null);

        // estamos atribuindo os dados lidos do servidor a variavel obj que recebe no Json
        var obj = JSON.parse(http.responseText);

        //validando se a data esta vazia
        if (obj.data.length == 0) {
            return;
        }

        var _lastIndexTemp = this.lastIndexTemp;
        // pegar o ultimo index lido
        this.lastIndexTemp = obj.data.length;
        listTemp = obj.data.slice(_lastIndexTemp);

        // estamos criando um laço de repetição que ira preencher nosso grafico com os dados vindo do Json
        listTemp.forEach(data => {

            if (chart.data.labels.length == 10 && chart.data.datasets[0].data.length == 10) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }
            // preechendo nosso grafico com os dados
            chart.data.labels.push(this.time++);
            chart.data.datasets[0].data.push(parseFloat(data));
            chart.update();
        });
        // apresentando a media
        document.getElementById('average').textContent = `Média de temperatura: ${obj.average}`
    }

    //chamando a função getdata() que contém todo nosso
    get_data();

    // o delay que sera para chamar no metodo getdata()
    setInterval(() => {
        get_data();
    }, 1000);
}