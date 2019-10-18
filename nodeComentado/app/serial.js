const SerialPort = require('serialport');
// estamos atibuindo a variavel Serial port todas as funções do serial port que vem do ode
const Readline = SerialPort.parsers.Readline;
// Read line recebe um função do serial port para ler a linha
class ArduinoDataRead {
    // estamos criando nossa classe chamada arduinoDataRead para setar nossas funções e devolve-las
    constructor() {
        // criando um vetor para ser preenchido pelos dados do arduino
        this.listData = [];
        this.listData2 = [];
    }

    get List() {
        // estamos retornando o vetorTemperatura preenchido
        return this.listData;
    }


    //GET RETORNAMOS ALGO E SET SETAMOS ALGO
    // iremos localizar o arduino caso o encontramos iremos preencher o vetor com os dados que  vem do arduino
    SetConnection() {
        // função para localizar o arduino
        SerialPort.list().then(listSerialDevices => {

            let listArduinoSerial = listSerialDevices.filter(serialDevice => {
                return serialDevice.vendorId == 2341 && serialDevice.productId == 43;
            });
            // se caso ele não achar apresentará o if abaixo
            if (listArduinoSerial.length != 1) {
                throw new Error("The Arduino was not connected or has many boards connceted");
            }

            // caso de certo apresentará o codigo abaixo 
            console.log("Arduino found in the com %s", listArduinoSerial[0].comName);

            return listArduinoSerial[0].comName;

        }).then(arduinoCom => {
            // depois de encontrado iremos definir os bits de comunicação com o arduino
            let arduino = new SerialPort(arduinoCom, { baudRate: 9600 });
            // estamos atribuindo a variavel parser tudo que o arduino leu na linha
            const parser = new Readline();
            arduino.pipe(parser);

            // parser.on ele ira preencher o veto de acordo com a linha lida 
            parser.on('data', (data) => {
                // estamos preenchendo o vetor temperatura com os dados aqui
                var Dht11 = data.split(':')
                this.listData.push(parseFloat(Dht11[0]));
            });

            parser.on('data', (data) => {
                // estamos preenchendo o vetor umidade com os dados aqui
                var Dht11 = data.split(':')
                this.listData.push(parseFloat(Dht11[1]));
            });

        }).catch(error => console.log(error));
    }
}


// aqui estamos instanciando a nossa classe ArduinoDataRead();
const serial = new ArduinoDataRead();
// aqui estamos chamando a nossa função setConnection();
serial.SetConnection();

//estamos exportando nossa classe ArduinoDataRead para qualquer arquivo no nosso projeto
// e o mesmo esta passando como parametro nosso vetor ja preenchido.
module.exports.ArduinoData = { List: serial.List }