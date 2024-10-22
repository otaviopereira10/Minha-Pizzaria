let slides = document.querySelector('.slides');
let buttons = document.querySelectorAll('.btn');
let currentIndex = 0;
let interval;

// Função para alterar o slide
function changeSlide(index = -1) {
    // Se um índice específico for passado (clique no botão), use-o, caso contrário incremente o índice
    if (index !== -1) {
        currentIndex = index;
    } else {
        currentIndex = (currentIndex + 1) % buttons.length;
    }
    
    // Movendo o slide
    slides.style.transform = `translateX(-${currentIndex * 50}%)`;

    // Atualizando o estado ativo dos botões
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === currentIndex);
    });
}

// Evento de clique nos botões
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        clearInterval(interval);  // Pausa o autoplay ao clicar
        changeSlide(index);  // Muda para o slide clicado
        autoPlay();  // Reinicia o autoplay
    });
});

// Função para autoplay
function autoPlay() {
    interval = setInterval(changeSlide, 4000);
}

// Inicializa o autoplay
autoPlay();

let produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let totalValor = 0;

function adicionar(nomeProduto, precoProduto) {
    const product = { produto: nomeProduto, preco: precoProduto };

    Swal.fire({
        title: "Adicionado ao Carrinho",
        text: `Você adicionou ${nomeProduto} - R$${precoProduto},00 ao carrinho`,
        icon: "success"
    }).then((result) => {
        if (result.isConfirmed) {
            produtosCarrinho.push(product);
            localStorage.setItem('carrinho', JSON.stringify(produtosCarrinho));
        }
    });
}

function mostrarCarrinho() {
    if (produtosCarrinho.length === 0) {
        Swal.fire({
            title: "Carrinho Vazio",
            text: "Seu carrinho está vazio!",
            icon: "info"
    });
    } else {
        const listaProdutos = ListaProdutos();

        swal.fire({
            title: "Seu Carrinho",
            icon: "info",
            confirmButtonText: "Finalizar Compra",
            showCancelButton: true,
            html:`
            <table>
                <tr><th>Nome</th><th>Valor</th></tr>
                ${listaProdutos}
                <tr><td><strong>Total:</strong></td><td><strong>R$ ${totalValor},00</strong></td></tr>
            </table>`
        }).then((result) => {
            if (result.isConfirmed) {
                finalizarCart();
            }
        });
    }
}



function ListaProdutos() {
    let listaProdutos = '';
    totalValor = 0;

    produtosCarrinho.forEach((produto) => {
        listaProdutos +=`
        <tr>
            <td>${produto.produto}</td>
            <td>${produto.preco},00</td>
        </tr>`;

        totalValor += produto.preco;
    });

    return listaProdutos;
}




function finalizarCart() {
    Swal.fire({
        icon: "question",
        confirmButtonText: "Enviar Pedido",
        showCancelButton: true,
        title: "Digite as informações de entrega!",
        html:`
        <form>
            <input id="end" placeholder="Endereço" required></input>
            <input id="tel" placeholder="Telefone" required></input>
            <input id="pag" placeholder="Forma de Pagamento" required></input>
        </form>
        `
    }).then((result) => {
        if (result.isConfirmed) {
            enviaWhats();
            window.location.reload();
        }
    });
}




function enviaWhats() {
    const endereco = document.getElementById("end").value;
    const telefone = document.getElementById("tel").value;
    const pagamento = document.getElementById("pag").value;

    const mensagem = `
    Olá,gostaria de fazer um pedido!
    Endereco: ${endereco}
    Telefone: ${telefone}
    Forema de Pagamento: ${pagamento}
    Total de Produtos: ${produtosCarrinho}
    `;

    let produtos = ListaProdutos();

    const whatsappUrl = 
    `https://wa.me/551515996373766?text=
    ${encodeURIComponent(
        mensagem + produtos + `\nTotal: R$ ${totalValor},00`
    )}`;
    localStorage.clear();
    window.open(whatsappUrl, '_blank');
}

