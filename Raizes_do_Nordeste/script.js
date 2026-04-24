// Dados mockados

var usuarios = [
  { nome: "Ana Paula", email: "ana@email.com", senha: "123456", pontos: 150 }
];

// Cardápio separado
var cardapio = {
  recife: [
    { id: 1, nome: "Cuscuz com Ovo", descricao: "Cuscuz quentinho com ovo mexido e manteiga de garrafa", preco: 12.00, categoria: "cafe" },
    { id: 2, nome: "Tapioca Nordestina", descricao: "Tapioca com queijo coalho e carne seca desfiada", preco: 15.00, categoria: "salgados" },
    { id: 3, nome: "Café Passado na Hora", descricao: "Café coado na hora, forte e saboroso", preco: 5.00, categoria: "cafe" },
    { id: 4, nome: "Bolo de Macaxeira", descricao: "Bolo úmido de macaxeira com coco ralado", preco: 8.00, categoria: "salgados" },
    { id: 5, nome: "Suco de Umbu", descricao: "Suco natural de umbu gelado, 300ml", preco: 9.00, categoria: "sucos" },
    { id: 6, nome: "Suco de Caju", descricao: "Suco natural de caju gelado, 300ml", preco: 9.00, categoria: "sucos" },
    { id: 7, nome: "Arrumadinho Junino", descricao: "Feijão fradinho, charque e vinagrete – especial festa junina!", preco: 18.00, categoria: "junino" },
    { id: 8, nome: "Canjica Cremosa", descricao: "Canjica branca com leite de coco e canela", preco: 14.00, categoria: "junino" }
  ],
  Ceará: [
    { id: 1, nome: "Cuscuz com Leite", descricao: "Cuscuz quentinho servido com leite quente", preco: 10.00, categoria: "cafe" },
    { id: 2, nome: "Tapioca de Frango", descricao: "Tapioca recheada com frango desfiado e cream cheese", preco: 16.00, categoria: "salgados" },
    { id: 3, nome: "Café com Leite", descricao: "Café passado com leite integral quentinho", preco: 6.00, categoria: "cafe" },
    { id: 4, nome: "Suco de Manga", descricao: "Suco natural de manga palmer, 300ml", preco: 8.00, categoria: "sucos" },
    { id: 5, nome: "Pamonha Nordestina", descricao: "Pamonha de milho verde com queijo – especial junho!", preco: 12.00, categoria: "junino" }
  ],
  natal: [
    { id: 1, nome: "Café da Manhã Completo", descricao: "Cuscuz, tapioca, café e suco – tudo junto!", preco: 25.00, categoria: "cafe" },
    { id: 2, nome: "Tapioca de Queijo Coalho", descricao: "Tapioca simples com queijo coalho grelhado", preco: 13.00, categoria: "salgados" },
    { id: 3, nome: "Suco de Acerola", descricao: "Suco de acerola natural, rico em vitamina C", preco: 7.00, categoria: "sucos" },
    { id: 4, nome: "Milho Cozido Junino", descricao: "Milho cozido temperado – especial festa junina!", preco: 6.00, categoria: "junino" }
  ]
};

// Opções de estado a ser escolhido
var usuarioLogado = null;
var carrinho = [];
var pedidos = [];
var categoriaAtual = "todos";
var unidadeAtual = "recife";

// Função pra trocar de tela
function mostrarTela(id) {
  var todasTelas = document.querySelectorAll(".tela");
  for (var i = 0; i < todasTelas.length; i++) {
    todasTelas[i].classList.remove("ativa");
  }
  document.getElementById(id).classList.add("ativa");
}

// Abas do cardápio principal
function mudarAba(nomeAba, botao) {
  document.getElementById("aba-cardapio").classList.add("escondido");
  document.getElementById("aba-meus-pedidos").classList.add("escondido");
  document.getElementById("aba-fidelidade").classList.add("escondido");

  // Remove ativo de todos os botões
  var botoesAba = document.querySelectorAll(".aba");
  for (var i = 0; i < botoesAba.length; i++) {
    botoesAba[i].classList.remove("ativa");
  }

  // Mostra a aba clicada
  document.getElementById("aba-" + nomeAba).classList.remove("escondido");
  botao.classList.add("ativa");

  // Carrega o conteúdo específico se necessário
  if (nomeAba === "meus-pedidos") {
    renderizarPedidos();
  }
  if (nomeAba === "fidelidade") {
    atualizarPontosFidelidade();
  }
}

// Autenticação do usuário
function fazerLogin() {
  var emailDigitado = document.getElementById("login-email").value.trim();
  var senhaDigitada = document.getElementById("login-senha").value;
  var msgErro = document.getElementById("erro-login");

  // Validação básica
  if (!emailDigitado || !senhaDigitada) {
    msgErro.textContent = "Preencha todos os campos.";
    return;
  }

  // Procura usuário na lista mockada
  var usuarioEncontrado = null;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === emailDigitado && usuarios[i].senha === senhaDigitada) {
      usuarioEncontrado = usuarios[i];
      break;
    }
  }

  if (!usuarioEncontrado) {
    msgErro.textContent = "E-mail ou senha incorretos.";
    return;
  }

  // Login bem sucedido
  usuarioLogado = usuarioEncontrado;
  msgErro.textContent = "";
  
  // Limpa campos
  document.getElementById("login-email").value = "";
  document.getElementById("login-senha").value = "";
  
  entrarNoCardapio();
}

// Cadastrando novo usuário
function fazerCadastro() {
  var nome = document.getElementById("cad-nome").value.trim();
  var email = document.getElementById("cad-email").value.trim();
  var senha = document.getElementById("cad-senha").value;
  var aceitouLGPD = document.getElementById("lgpd-check").checked;
  var msgErro = document.getElementById("erro-cadastro");

  // Validações
  if (!nome || !email || !senha) {
    msgErro.textContent = "Preencha todos os campos.";
    return;
  }

  if (!aceitouLGPD) {
    msgErro.textContent = "Você precisa aceitar a Política de Privacidade (LGPD) para continuar.";
    return;
  }

  // Verifica se já existe
  var jaExiste = false;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      jaExiste = true;
      break;
    }
  }

  if (jaExiste) {
    msgErro.textContent = "E-mail já cadastrado.";
    return;
  }

  // Cria novo usuário
  var novoUsuario = { 
    nome: nome, 
    email: email, 
    senha: senha, 
    pontos: 0 
  };
  usuarios.push(novoUsuario);
  usuarioLogado = novoUsuario;
  
  msgErro.textContent = "";

  // Limpa formulário
  document.getElementById("cad-nome").value = "";
  document.getElementById("cad-email").value = "";
  document.getElementById("cad-senha").value = "";
  document.getElementById("lgpd-check").checked = false;

  entrarNoCardapio();
}

// Redireciona pro cardápio após login/cadastro
function entrarNoCardapio() {
  carrinho = []; 
  categoriaAtual = "todos";
  unidadeAtual = "recife";
  document.getElementById("select-unidade").value = "recife";
  
  var primeiroNome = usuarioLogado.nome.split(" ")[0];
  document.getElementById("nome-usuario").textContent = "Olá, " + primeiroNome;
  document.getElementById("badge-pontos").textContent = "⭐ " + usuarioLogado.pontos + " pts";
  
  carregarCardapio();
  mostrarTela("tela-cardapio");
  atualizarCarrinhoBtn();
}

// Sair da conta
function sair() {
  usuarioLogado = null;
  carrinho = [];
  mostrarTela("tela-login");
}

// Carrega produtos da unidade selecionada
function carregarCardapio() {
  unidadeAtual = document.getElementById("select-unidade").value;
  
  var botaoAtivo = document.querySelector(".cat.ativa");
  filtrarCategoria(categoriaAtual, botaoAtivo);
}

// Filtra produtos por categoria
function filtrarCategoria(categoria, botaoClicado) {
  categoriaAtual = categoria;

  // Atualização visual dos botões
  var todosBotoesCat = document.querySelectorAll(".cat");
  for (var i = 0; i < todosBotoesCat.length; i++) {
    todosBotoesCat[i].classList.remove("ativa");
  }
  if (botaoClicado) {
    botaoClicado.classList.add("ativa");
  }

  var produtosDaUnidade = cardapio[unidadeAtual];
  var produtosFiltrados = [];

  if (categoria === "todos") {
    produtosFiltrados = produtosDaUnidade;
  } else {
    // Filtro manual
    for (var i = 0; i < produtosDaUnidade.length; i++) {
      if (produtosDaUnidade[i].categoria === categoria) {
        produtosFiltrados.push(produtosDaUnidade[i]);
      }
    }
  }

  renderizarProdutos(produtosFiltrados);
}

// Renderiza os cards de produtos na tela
function renderizarProdutos(listaProdutos) {
  var container = document.getElementById("lista-produtos");
  container.innerHTML = "";

  if (listaProdutos.length === 0) {
    container.innerHTML = "<p style='color:#888;padding:20px;'>Nenhum produto nessa categoria para esta unidade.</p>";
    return;
  }

  for (var i = 0; i < listaProdutos.length; i++) {
    var produto = listaProdutos[i];
    
    // Aba especial de produtos juninos
    var badgeJunino = "";
    if (produto.categoria === "junino") {
      badgeJunino = "<span class='badge-junino'>🎉 Especial Junino</span>";
    }

    var cardDiv = document.createElement("div");
    cardDiv.className = "card-produto";
    
    var precoFormatado = produto.preco.toFixed(2).replace(".", ",");
    
    cardDiv.innerHTML = 
      badgeJunino +
      "<h4>" + produto.nome + "</h4>" +
      "<p class='descricao'>" + produto.descricao + "</p>" +
      "<span class='preco'>R$ " + precoFormatado + "</span>" +
      "<button onclick='adicionarAoCarrinho(" + produto.id + ")'>+ Adicionar</button>";
    
    container.appendChild(cardDiv);
  }
}

// Adiciona produto ao carrinho
function adicionarAoCarrinho(idProduto) {
  var produtosDaUnidade = cardapio[unidadeAtual];
  var produtoSelecionado = null;
  
  // Procura o produto
  for (var i = 0; i < produtosDaUnidade.length; i++) {
    if (produtosDaUnidade[i].id === idProduto) {
      produtoSelecionado = produtosDaUnidade[i];
      break;
    }
  }
  
  if (!produtoSelecionado) return;

  var itemExistente = null;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === idProduto && carrinho[i].unidade === unidadeAtual) {
      itemExistente = carrinho[i];
      break;
    }
  }

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ 
      id: produtoSelecionado.id, 
      nome: produtoSelecionado.nome, 
      preco: produtoSelecionado.preco, 
      quantidade: 1, 
      unidade: unidadeAtual 
    });
  }

  atualizarCarrinhoBtn();

  // Retorno da tela para o usuário
  var botao = event.target;
  var textoOriginal = botao.textContent;
  botao.textContent = "✓ Adicionado!";
  botao.style.background = "#2e7d32";
  
  setTimeout(function() {
    botao.textContent = textoOriginal;
    botao.style.background = "";
  }, 1200);
}

// Remove item do carrinho
function removerDoCarrinho(indice) {
  carrinho.splice(indice, 1);
  atualizarCarrinhoBtn();
  mostrarCarrinho(); // Atualiza a tela
}

function atualizarCarrinhoBtn() {
  var totalValor = 0;
  var totalItens = 0;
  
  for (var i = 0; i < carrinho.length; i++) {
    totalValor += carrinho[i].preco * carrinho[i].quantidade;
    totalItens += carrinho[i].quantidade;
  }

  document.getElementById("qtd-carrinho").textContent = totalItens;
  document.getElementById("total-carrinho").textContent = totalValor.toFixed(2).replace(".", ",");

  var botaoCarrinho = document.getElementById("carrinho-btn");
  if (totalItens > 0) {
    botaoCarrinho.classList.add("visivel");
  } else {
    botaoCarrinho.classList.remove("visivel");
  }
}

// Exibe a tela do carrinho
function mostrarCarrinho() {
  var container = document.getElementById("itens-carrinho");
  container.innerHTML = "";
  document.getElementById("erro-carrinho").textContent = "";

  if (carrinho.length === 0) {
    container.innerHTML = "<p style='color:#888;text-align:center;padding:20px;'>Carrinho vazio.</p>";
    document.getElementById("total-carrinho-2").textContent = "R$ 0,00";
    mostrarTela("tela-carrinho");
    return;
  }

  var valorTotal = 0;
  
  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];
    var subtotal = item.preco * item.quantidade;
    valorTotal += subtotal;
    
    var itemDiv = document.createElement("div");
    itemDiv.className = "item-carrinho";
    itemDiv.innerHTML = 
      "<span class='nome-item'>" + item.nome + " x" + item.quantidade + "</span>" +
      "<span class='preco-item'>R$ " + subtotal.toFixed(2).replace(".", ",") + "</span>" +
      "<button onclick='removerDoCarrinho(" + i + ")'>✕</button>";
    
    container.appendChild(itemDiv);
  }

  document.getElementById("total-carrinho-2").textContent = "R$ " + valorTotal.toFixed(2).replace(".", ",");
  mostrarTela("tela-carrinho");
}

// Finaliza pedido e processa pagamento
function finalizarPedido() {
  var formaPagamento = document.getElementById("forma-pagamento").value;
  var msgErro = document.getElementById("erro-carrinho");

  if (carrinho.length === 0) {
    msgErro.textContent = "Seu carrinho está vazio.";
    return;
  }
  
  if (!formaPagamento) {
    msgErro.textContent = "Selecione uma forma de pagamento.";
    return;
  }

  // Simulação do processamento do pagamento
  msgErro.textContent = "⏳ Aguardando confirmação do pagamento...";

  setTimeout(function() {
    var valorTotalPedido = 0;
    for (var i = 0; i < carrinho.length; i++) {
      valorTotalPedido += carrinho[i].preco * carrinho[i].quantidade;
    }

    var numeroDoPedido = "RN-" + Date.now().toString().slice(-6);
    var pontosGanhos = Math.floor(valorTotalPedido); // 1 ponto = 1 real

    pedidos.unshift({
      numero: numeroDoPedido,
      itens: carrinho.slice(),
      total: valorTotalPedido,
      status: "Pronto",
      pagamento: formaPagamento,
      data: new Date().toLocaleDateString("pt-BR")
    });

    // Adiciona pontos ao usuário
    usuarioLogado.pontos += pontosGanhos;
    document.getElementById("badge-pontos").textContent = "⭐ " + usuarioLogado.pontos + " pts";

    carrinho = [];
    atualizarCarrinhoBtn();

    document.getElementById("numero-pedido").textContent = "Pedido " + numeroDoPedido;
    document.getElementById("pontos-ganhos").textContent = "+ " + pontosGanhos + " pontos adicionados ao seu saldo!";
    document.getElementById("forma-pagamento").value = "";

    simularProgressoPedido();
    mostrarTela("tela-status");
  }, 1800);
}

// Simula as etapas do pedido
function simularProgressoPedido() {
  var etapas = ["step-confirmado", "step-preparo", "step-pronto", "step-retirado"];
  var mensagens = [
    "Pedido confirmado! Aguardando preparo.",
    "Seu pedido está sendo preparado na cozinha.",
    "🔔 Pedido pronto! Retire no balcão.",
    "✅ Pedido retirado. Obrigado!"
  ];

  for (var i = 0; i < etapas.length; i++) {
    document.getElementById(etapas[i]).classList.remove("ativo");
  }

  var etapaAtual = 0;
  document.getElementById(etapas[0]).classList.add("ativo");
  document.getElementById("status-texto").textContent = mensagens[0];

  var timer = setInterval(function() {
    etapaAtual++;
    if (etapaAtual >= etapas.length) {
      clearInterval(timer);
      return;
    }
    document.getElementById(etapas[etapaAtual]).classList.add("ativo");
    document.getElementById("status-texto").textContent = mensagens[etapaAtual];
  }, 3000);
}

// Volta pro cardápio
function voltarCardapio() {
  mostrarTela("tela-cardapio");
  
  var primeiraAba = document.querySelector(".aba");
  mudarAba("cardapio", primeiraAba);
  carregarCardapio();
}

// Junta o histórico de pedidos
function renderizarPedidos() {
  var container = document.getElementById("lista-pedidos");
  container.innerHTML = "";

  if (pedidos.length === 0) {
    container.innerHTML = "<p style='color:#888;padding:20px;text-align:center;'>Você ainda não fez nenhum pedido.</p>";
    return;
  }

  for (var i = 0; i < pedidos.length; i++) {
    var pedido = pedidos[i];
    
    var nomesItens = "";
    for (var j = 0; j < pedido.itens.length; j++) {
      if (j > 0) nomesItens += ", ";
      nomesItens += pedido.itens[j].nome + " x" + pedido.itens[j].quantidade;
    }
    
    var cardDiv = document.createElement("div");
    cardDiv.className = "card-pedido";
    cardDiv.innerHTML = 
      "<div class='ped-header'><strong>" + pedido.numero + "</strong><span class='ped-status'>" + pedido.status + "</span></div>" +
      "<p class='ped-itens'>" + nomesItens + "</p>" +
      "<p class='ped-total'>R$ " + pedido.total.toFixed(2).replace(".", ",") + " – " + pedido.data + " – " + pedido.pagamento + "</p>";
    
    container.appendChild(cardDiv);
  }
}

// Atualiza saldo de pontos na tela de fidelidade
function atualizarPontosFidelidade() {
  document.getElementById("pontos-total").textContent = usuarioLogado.pontos;
}

// Resgata recompensa com pontos
function resgatar(custo, nomeRecompensa) {
  var mensagem = document.getElementById("msg-fidelidade");

  if (usuarioLogado.pontos < custo) {
    mensagem.style.color = "red";
    mensagem.textContent = "Você não tem pontos suficientes. Necessário: " + custo + " pts.";
    return;
  }

  // Credita os pontos
  usuarioLogado.pontos -= custo;
  document.getElementById("badge-pontos").textContent = "⭐ " + usuarioLogado.pontos + " pts";
  atualizarPontosFidelidade();

  mensagem.style.color = "green";
  mensagem.textContent = "✅ Recompensa resgatada: " + nomeRecompensa + "! Apresente ao atendente.";

  // Limpa mensagem
  setTimeout(function() { 
    mensagem.textContent = ""; 
  }, 4000);
}