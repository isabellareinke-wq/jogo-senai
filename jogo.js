
// ==================================================
// CONFIGURAÇÕES INICIAIS
// ==================================================

const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");


// ==================================================
// CHÃO
// ==================================================

const chaoY = 250;


// ==================================================
// DINOSSAURO
// ==================================================

let dinoX = 80;
let dinoY = chaoY - 50;

const dinoLargura = 40;
const dinoAltura = 50;


// ==================================================
// FÍSICA DO PULO
// ==================================================

let velocidadeY = 0;

const gravidade = 0.8;
const forcaDoPulo = -13;

let noChao = true;


// ==================================================
// CACTOS
// ==================================================

let cactos = [];

// Velocidade inicial dos cactos.
const velocidadeInicial = 5;

// Velocidade atual dos cactos.
let velocidadeCacto = velocidadeInicial;

// Velocidade máxima.
const velocidadeMaxima = 8;


// ==================================================
// TEMPO DOS CACTOS
// ==================================================

let tempoParaProximoCacto = 1000;


// ==================================================
// PONTUAÇÃO
// ==================================================

// Pontuação atual.
let pontuacao = 0;

// Controle do tempo da pontuação.
let tempoPontuacao = 0;


// ==================================================
// RECORDE
// ==================================================

/*
    Pega o recorde salvo no navegador.

    Se não existir nenhum recorde,
    começa com 0.
*/
let recorde =
    Number(localStorage.getItem("recordeDino")) || 0;


// ==================================================
// ESTADO DO JOGO
// ==================================================

let jogoTerminou = false;


// ==================================================
// DESENHAR O CHÃO
// ==================================================

function desenharChao() {

    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, chaoY);
    ctx.lineTo(canvas.width, chaoY);

    ctx.stroke();
}


// ==================================================
// DESENHAR O DINOSSAURO
// ==================================================

function desenharDino() {

    ctx.fillStyle = "#333333";

    // Corpo
    ctx.fillRect(
        dinoX,
        dinoY + 15,
        28,
        35
    );

    // Cabeça
    ctx.fillRect(
        dinoX + 20,
        dinoY,
        25,
        25
    );

    // Pescoço
    ctx.fillRect(
        dinoX + 25,
        dinoY + 10,
        10,
        15
    );

    // Perna esquerda
    ctx.fillRect(
        dinoX + 5,
        dinoY + 42,
        8,
        10
    );

    // Perna direita
    ctx.fillRect(
        dinoX + 20,
        dinoY + 42,
        8,
        10
    );

    // Cauda
    ctx.fillRect(
        dinoX - 10,
        dinoY + 20,
        12,
        8
    );

    // Olho
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        dinoX + 36,
        dinoY + 6,
        4,
        4
    );
}


// ==================================================
// CRIAR UM CACTO
// ==================================================

function criarCacto() {

    // Escolhe uma altura aleatória.
    const altura =
        Math.floor(Math.random() * 35) + 30;

    const largura = 20;

    const cacto = {

        // Começa no lado direito.
        x: canvas.width,

        // Fica sobre o chão.
        y: chaoY - altura,

        largura: largura,
        altura: altura
    };

    cactos.push(cacto);
}


// ==================================================
// DESENHAR OS CACTOS
// ==================================================

function desenharCactos() {

    for (let cacto of cactos) {

        // Cor verde.
        ctx.fillStyle = "#228B22";

        // Corpo do cacto.
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );

        // Braço esquerdo.
        ctx.fillRect(
            cacto.x - 8,
            cacto.y + cacto.altura * 0.45,
            8,
            8
        );

        // Parte vertical do braço esquerdo.
        ctx.fillRect(
            cacto.x - 8,
            cacto.y + cacto.altura * 0.30,
            8,
            cacto.altura * 0.15
        );

        // Braço direito.
        ctx.fillRect(
            cacto.x + cacto.largura,
            cacto.y + cacto.altura * 0.30,
            8,
            8
        );

        // Parte vertical do braço direito.
        ctx.fillRect(
            cacto.x + cacto.largura,
            cacto.y + cacto.altura * 0.30,
            8,
            cacto.altura * 0.15
        );
    }
}


// ==================================================
// DESENHAR PONTUAÇÃO E RECORDE
// ==================================================

function desenharPontuacao() {

    /*
        A pontuação sempre terá 5 dígitos.

        Exemplos:

        5    -> 00005
        25   -> 00025
        100  -> 00100
        340  -> 00340
    */
    const textoPontuacao =
        pontuacao.toString().padStart(5, "0");


    // O recorde também terá 5 dígitos.
    const textoRecorde =
        recorde.toString().padStart(5, "0");


    ctx.fillStyle = "#333333";
    ctx.font = "20px Arial";

    // Alinha os textos pela direita.
    ctx.textAlign = "right";


    // Pontuação atual.
    ctx.fillText(
        textoPontuacao,
        canvas.width - 180,
        30
    );


    // Recorde.
    ctx.fillText(
        "HI " + textoRecorde,
        canvas.width - 15,
        30
    );


    // Volta o alinhamento ao normal.
    ctx.textAlign = "left";
}


// ==================================================
// ATUALIZAR O DINOSSAURO
// ==================================================

function atualizarDino() {

    // Gravidade.
    velocidadeY += gravidade;

    // Movimento vertical.
    dinoY += velocidadeY;


    // Verifica se chegou ao chão.
    if (dinoY + dinoAltura >= chaoY) {

        dinoY = chaoY - dinoAltura;

        velocidadeY = 0;

        noChao = true;
    }
}


// ==================================================
// ATUALIZAR OS CACTOS
// ==================================================

function atualizarCactos() {

    // Move os cactos para a esquerda.
    for (let cacto of cactos) {

        cacto.x -= velocidadeCacto;
    }


    // Remove os cactos que saíram da tela.
    cactos = cactos.filter(function(cacto) {

        return cacto.x + cacto.largura > 0;

    });
}


// ==================================================
// CONTROLAR O SURGIMENTO DOS CACTOS
// ==================================================

function controlarCactos() {

    // Diminui o contador.
    tempoParaProximoCacto -= 16;


    // Quando chega a zero,
    // cria um novo cacto.
    if (tempoParaProximoCacto <= 0) {

        criarCacto();


        /*
            Próximo cacto aparecerá
            entre 1 e 2,5 segundos.
        */
        tempoParaProximoCacto =
            Math.random() * 1500 + 1000;
    }
}


// ==================================================
// ATUALIZAR A PONTUAÇÃO
// ==================================================

function atualizarPontuacao() {

    /*
        O contador aumenta aproximadamente
        16 milissegundos a cada quadro.
    */
    tempoPontuacao += 16;


    /*
        Quando passa aproximadamente 1 segundo,
        adicionamos 5 pontos.

        Antes era apenas 1 ponto.
    */
    if (tempoPontuacao >= 1000) {

        // Aumenta 5 pontos.
        pontuacao += 5;

        // Reinicia o contador.
        tempoPontuacao = 0;

        // Verifica se existe um novo recorde.
        verificarNovoRecorde();
    }
}


// ==================================================
// VERIFICAR NOVO RECORDE
// ==================================================

function verificarNovoRecorde() {

    /*
        Se a pontuação atual for maior
        que o recorde...
    */
    if (pontuacao > recorde) {

        // Atualiza o recorde.
        recorde = pontuacao;


        /*
            Salva o recorde no navegador.

            "recordeDino" é o nome usado
            para encontrar essa informação depois.
        */
        localStorage.setItem(
            "recordeDino",
            recorde
        );
    }
}


// ==================================================
// ATUALIZAR A VELOCIDADE
// ==================================================

function atualizarVelocidade() {

    /*
        A cada 100 pontos,
        aumenta um pouco a velocidade.

        Como agora ganhamos 5 pontos por segundo,
        a velocidade aumentará mais rapidamente.
    */
    const nivel =
        Math.floor(pontuacao / 100);


    velocidadeCacto =
        velocidadeInicial + nivel * 0.5;


    // Limita a velocidade máxima.
    if (velocidadeCacto > velocidadeMaxima) {

        velocidadeCacto = velocidadeMaxima;
    }
}


// ==================================================
// VERIFICAR COLISÃO
// ==================================================

function verificarColisao() {

    for (let cacto of cactos) {

        /*
            Comparamos os retângulos
            do dinossauro e do cacto.
        */
        if (

            dinoX <
            cacto.x + cacto.largura &&

            dinoX + dinoLargura >
            cacto.x &&

            dinoY <
            cacto.y + cacto.altura &&

            dinoY + dinoAltura >
            cacto.y

        ) {

            // O jogador bateu.
            jogoTerminou = true;

            break;
        }
    }
}


// ==================================================
// FAZER O DINOSSAURO PULAR
// ==================================================

function pular() {

    // Só pula quando está no chão.
    if (noChao) {

        velocidadeY = forcaDoPulo;

        noChao = false;
    }
}


// ==================================================
// DESENHAR GAME OVER
// ==================================================

function desenharGameOver() {

    // Texto principal.
    ctx.fillStyle = "#333333";

    ctx.font = "bold 40px Arial";

    ctx.textAlign = "center";


    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        130
    );


    // Mensagem para reiniciar.
    ctx.font = "20px Arial";


    ctx.fillText(
        "Aperte espaço para jogar de novo",
        canvas.width / 2,
        170
    );


    // Mostra a pontuação final.
    ctx.font = "18px Arial";


    const textoPontuacao =
        pontuacao.toString().padStart(5, "0");


    ctx.fillText(
        "Pontuação: " + textoPontuacao,
        canvas.width / 2,
        200
    );


    ctx.textAlign = "left";
}


// ==================================================
// REINICIAR O JOGO
// ==================================================

function reiniciarJogo() {

    // DINOSSAURO
    dinoX = 80;

    dinoY = chaoY - dinoAltura;

    velocidadeY = 0;

    noChao = true;


    // CACTOS
    cactos = [];

    tempoParaProximoCacto = 1000;


    // PONTUAÇÃO
    pontuacao = 0;

    tempoPontuacao = 0;


    // VELOCIDADE
    velocidadeCacto = velocidadeInicial;


    // JOGO
    jogoTerminou = false;
}


// ==================================================
// CONTROLE DO TECLADO
// ==================================================

document.addEventListener(
    "keydown",
    function(event) {

        /*
            Se o jogo terminou e apertarmos espaço,
            reiniciamos o jogo.
        */
        if (
            event.code === "Space" &&
            jogoTerminou
        ) {

            event.preventDefault();

            reiniciarJogo();

            return;
        }


        /*
            Espaço ou seta para cima fazem
            o dinossauro pular.
        */
        if (

            !jogoTerminou &&

            (
                event.code === "Space" ||
                event.code === "ArrowUp"
            )

        ) {

            event.preventDefault();

            pular();
        }
    }
);


// ==================================================
// DESENHAR O JOGO
// ==================================================

function desenhar() {

    // Limpa o canvas.
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Desenha o chão.
    desenharChao();


    // Desenha o dinossauro.
    desenharDino();


    // Desenha os cactos.
    desenharCactos();


    // Desenha pontuação e recorde.
    desenharPontuacao();


    // Mostra GAME OVER se o jogo terminou.
    if (jogoTerminou) {

        desenharGameOver();
    }
}


// ==================================================
// ATUALIZAR O JOGO
// ==================================================

function atualizar() {

    /*
        Se o jogo terminou,
        não atualizamos mais nada.
    */
    if (jogoTerminou) {

        return;
    }


    // Atualiza o dinossauro.
    atualizarDino();


    // Atualiza os cactos.
    atualizarCactos();


    // Cria novos cactos.
    controlarCactos();


    // Atualiza a pontuação.
    atualizarPontuacao();


    // Atualiza a velocidade.
    atualizarVelocidade();


    // Verifica colisões.
    verificarColisao();
}


// ==================================================
// LOOP PRINCIPAL
// ==================================================

function loop() {

    // Atualiza a lógica.
    atualizar();


    // Desenha tudo.
    desenhar();


    // Continua o jogo.
    requestAnimationFrame(loop);
}


// ==================================================
// INICIAR O JOGO
// ==================================================

loop();
