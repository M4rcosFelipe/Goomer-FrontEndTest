function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let groups = [];
let listaRestaurantes;
const DEFAULT_IMAGE = "../public/images/dish.png";
const DEFAULT_PRICE = 0;
const DEFAULT_PROMO = 0;
const RESTAURANT_ID = getId();
let Cart = {
  items: [],
  total: 0
};
let identificadores = [];
let identificador = 0;
var menuData = "";

function getId() {
  const id = location.search[location.search.indexOf("=") + 1];
  return id;
}

function setMenuData() {
  return _setMenuData.apply(this, arguments);
} //funções de requisição


function _setMenuData() {
  _setMenuData = _asyncToGenerator(function* () {
    const resposta = yield getMenu();
    menuData = resposta;
  });
  return _setMenuData.apply(this, arguments);
}

function getRestaurants() {
  return _getRestaurants.apply(this, arguments);
}

function _getRestaurants() {
  _getRestaurants = _asyncToGenerator(function* () {
    try {
      const response = yield fetch("https://challange.goomer.com.br/restaurants");
      const data = yield response.json();
      listaRestaurantes = data;
      return data;
    } catch (error) {
      console.log("Fetch failed: ", error);
    }
  });
  return _getRestaurants.apply(this, arguments);
}

function getMenu() {
  return _getMenu.apply(this, arguments);
}

function _getMenu() {
  _getMenu = _asyncToGenerator(function* () {
    const id = RESTAURANT_ID;
    const response = yield fetch(`https://challange.goomer.com.br/restaurants/${id}/menu`);
    const data = yield response.json();
    return data;
  });
  return _getMenu.apply(this, arguments);
}

function getHeader() {
  return _getHeader.apply(this, arguments);
} //funções uteis


function _getHeader() {
  _getHeader = _asyncToGenerator(function* () {
    const restaurantes = yield getRestaurants();
    const id = RESTAURANT_ID;
    let restauranteData = "";

    for (let i = 0; i < restaurantes.length; i++) {
      if (restaurantes[i].id == id) {
        restauranteData = restaurantes[i];
        return restauranteData;
      }
    }
  });
  return _getHeader.apply(this, arguments);
}

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function retiraEspacos(string) {
  let newString = "";

  for (let i = 0; i < string.length; i++) {
    if (string[i] !== " ") {
      newString += string[i];
    }
  }

  return newString;
}

function toCleanString(string) {
  return retiraEspacos(string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} //criando header


function createHeader() {
  return _createHeader.apply(this, arguments);
}

function _createHeader() {
  _createHeader = _asyncToGenerator(function* () {
    const header = yield getHeader();
    const pageHeader = document.querySelector(".restaurant-data");
    const horarios = createHorarioHeader(header);
    pageHeader.innerHTML = `<img class="restaurant--image"src="${header.image}">
                        <div class="wrapper">
                            <h1 class="restaurant--name">${header.name}</h1>
                            <p class="restaurant-description">${header.address}</p>
                            
                            ${horarios}
                        </div>`;
  });
  return _createHeader.apply(this, arguments);
}

function createHorarioHeader(restaurante) {
  var horariosContent = "Aberto 24h";

  if (restaurante.hours) {
    horariosContent = "";

    for (let j = 0; j < restaurante.hours.length; j++) {
      if (Number(converteHora(restaurante.hours[j].from)) > Number(converteHora(restaurante.hours[j].to))) {
        restaurante.hours[j].days.push(restaurante.hours[j].days[restaurante.hours[j].days.length - 1] + 1);
      }

      const dias = converteDias(restaurante.hours[j].days);
      horariosContent += `<p>${dias}: <span class="horario">${restaurante.hours[j].from} às ${restaurante.hours[j].to}</span></p>`;
    }
  }

  return ` 
          <div class="horarios">
              ${horariosContent}
          </div>`;
}

function converteDias(lista) {
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return `${diasDaSemana[lista[0] - 1]} à ${diasDaSemana[lista[lista.length - 1] - 1]}`;
} //criando menu
//funções de data
//////////////////////////////////////////


function isPromo(menuItemData) {
  let response = "";

  for (let j = 0; j < menuItemData.sales.length; j++) {
    response = verificaPromo(menuItemData.sales[j]);

    if (response) {
      break;
    }
  }

  return response;
}

function converteHora(stringHora) {
  let hora = "";

  for (let i = 0; i < 2; i++) {
    hora += stringHora[i];
  }

  if (hora[0] === "0") {
    hora = hora[1];
  }

  return hora;
}

function verificaDia(dias) {
  //array com os dias
  //verifica se é DIA de promoção
  const today = new Date(); //teste
  // today.setDate() 

  const diaAtual = today.getDay() + 1; // console.log(`Dia atual: ${diaAtual}`)

  const isDay = dias.indexOf(diaAtual);
  return isDay !== -1 ? true : false;
}

function verificaHora(horas) {
  //elemento do array hours
  const from = converteHora(horas.from);
  const to = converteHora(horas.to);
  const now = new Date(); //teste
  // now.setHours()
  // console.log(`Hora atual: ${now.getHours()}`)
  // console.log(`from: ${from}`)
  // console.log(`to: ${to}`)

  if (now.getHours() >= from && now.getHours() < to) {
    return true;
  } else {
    return false;
  }
}

function verificaPromo(salesData) {
  //1 elemento do array de sales
  let isPromoHour;
  let isPromoDay;

  for (let i = 0; i < salesData.hours.length; i++) {
    //verifica se é Dia de promoção
    isPromoDay = verificaDia(salesData.hours[i].days); //verifica se é hora de promoção

    isPromoHour = verificaHora(salesData.hours[i]);

    if (isPromoHour && isPromoDay) {
      return true;
    }
  }

  return false;
} /////////////////////////////////////////////////////////////////////////


function createMenu() {
  return _createMenu.apply(this, arguments);
}

function _createMenu() {
  _createMenu = _asyncToGenerator(function* () {
    const cardapio = document.querySelector("#cardapio");
    cardapio.innerHTML = yield createMenuLabels();
    yield createMenuOptions();
  });
  return _createMenu.apply(this, arguments);
}

function createMenuLabels() {
  return _createMenuLabels.apply(this, arguments);
}

function _createMenuLabels() {
  _createMenuLabels = _asyncToGenerator(function* () {
    for (let i = 0; i < menuData.length; i++) {
      if (groups.indexOf(capitalize(menuData[i].group)) === -1) {
        groups.push(capitalize(menuData[i].group));
      }
    }

    let labels = "";

    for (let j = 0; j < groups.length; j++) {
      labels += `<li class="cardapio-item "> 
                  <label for="${toCleanString(groups[j])}-options" id="cardapio-label">${groups[j]}</label>
                  <input type="checkbox" class="checkbox-input" id="${toCleanString(groups[j])}-options">
                  <ul class="options ${toCleanString(groups[j])}">
                  </ul>
              </li>`;
    }

    return labels;
  });
  return _createMenuLabels.apply(this, arguments);
}

function createMenuOptions() {
  return _createMenuOptions.apply(this, arguments);
}

function _createMenuOptions() {
  _createMenuOptions = _asyncToGenerator(function* () {
    for (let i = 0; i < groups.length; i++) {
      const label = document.querySelector("." + toCleanString(groups[i]));
      label.innerHTML = yield createMenuOptionsContent(groups[i]);
    }
  });
  return _createMenuOptions.apply(this, arguments);
}

function createOptionsItem(_x, _x2) {
  return _createOptionsItem.apply(this, arguments);
}

function _createOptionsItem() {
  _createOptionsItem = _asyncToGenerator(function* (data, index) {
    let item = "";
    const menuItemData = data;

    if (!menuItemData.price) {
      menuItemData.price = DEFAULT_PRICE;
    }

    if (!menuItemData.image) {
      menuItemData.image = DEFAULT_IMAGE;
    }

    if (!menuItemData.promo) {
      menuItemData.promo = DEFAULT_PROMO;
    }

    if (menuItemData.sales) {
      if (isPromo(menuItemData)) {
        menuItemData.promo = `<div class="promo">
                              <img class="logo-promo" src="./images/award.svg"/>
                              Promo Almoço
                          </div>`;
        menuItemData.pricePromo = menuItemData.sales[0].price;
        const priceAux = menuItemData.pricePromo;
        menuItemData.pricePromo = `<strike>R$${menuItemData.price.toFixed(2)}</strike>`;
        menuItemData.price = priceAux;
      } else {
        menuItemData.pricePromo = "";
        menuItemData.promo = "";
      }
    } else {
      menuItemData.pricePromo = "";
      menuItemData.promo = "";
    }

    item = ` <li class="menu-item" onclick="showModal(${index})">
              <img class="prato-image" src="${menuItemData.image}">
              <div class="prato-wrapper">
                  <div class="name-wrapper">                         
                      <h1 class="prato-name">${menuItemData.name}</h1>
                      ${menuItemData.promo}
                      
                  </div>  
                  <p class="prato-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
          
                  <div class="preco">
                      <p>R$${menuItemData.price.toFixed(2)}</p>${menuItemData.pricePromo}
                  </div>
              </div>
          </li>`;
    return item;
  });
  return _createOptionsItem.apply(this, arguments);
}

function createMenuOptionsContent(_x3) {
  return _createMenuOptionsContent.apply(this, arguments);
}

function _createMenuOptionsContent() {
  _createMenuOptionsContent = _asyncToGenerator(function* (group) {
    let optionsData = "";

    for (let i = 0; i < menuData.length; i++) {
      const menuItemData = menuData[i];

      if (toCleanString(menuItemData.group) === toCleanString(group)) {
        optionsData += yield createOptionsItem(menuItemData, i);
      }
    }

    return optionsData;
  });
  return _createMenuOptionsContent.apply(this, arguments);
}

function verifyPromo() {
  const items = document.querySelectorAll(".menu-item");

  for (let i = 0; i < menuData.length; i++) {
    if (!menuData[i].sales) continue;

    if (isPromo(menuData[i])) {
      if (!items[i].children[1].children[0].querySelector(".promo")) {
        items[i].children[1].children[0].innerHTML += `<div class="promo">
                                                        <img class="logo-promo" src="./images/award.svg"/>
                                                        Promo Almoço
                                                    </div>`;
        items[i].children[1].children[2].innerHTML = `<p>R$${menuData[i].sales[0].price.toFixed(2)}</p><strike>R$${menuData[i].price.toFixed(2)}</strike>`;
      }
    } else {
      if (items[i].children[1].children[0].querySelector(".promo")) {
        items[i].children[1].children[0].querySelector(".promo").remove();
        items[i].children[1].children[2].innerHTML = `<p>R$${menuData[i].price.toFixed(2)}</p>`;
      }
    }
  }
} //renderizando input


function renderInputSearch() {
  const header = document.querySelector(".restaurant-data");
  const input = `<form class="form-search">
                  <label><span class="search-span">Buscar no Cardápio</span><input class="buscar-no-cardapio" type="text" onsubmit="buscar()"/></label>
                </form>
                <button id="search-button"></button>`;
  header.insertAdjacentHTML("afterend", input);
} //renderiza pagina


function renderPage() {
  return _renderPage.apply(this, arguments);
} //mecanismo de busca//


function _renderPage() {
  _renderPage = _asyncToGenerator(function* () {
    yield setMenuData();
    yield createHeader();
    renderInputSearch();
    yield createMenu();
    document.querySelector("#loading").remove();
    createSearchEvent();
    setInterval(() => verifyPromo(), 100);
  });
  return _renderPage.apply(this, arguments);
}

function createSearchEvent() {
  const formSearch = document.querySelector(".form-search");
  formSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    searchButton.click();
  });
  const searchButton = document.querySelector("#search-button");
  searchButton.addEventListener("click", function () {
    buscarNoCardapio();
  });
}

function buscarNoCardapio() {
  return _buscarNoCardapio.apply(this, arguments);
}

function _buscarNoCardapio() {
  _buscarNoCardapio = _asyncToGenerator(function* () {
    const palavra = toCleanString(document.querySelector(".buscar-no-cardapio").value);
    if (!palavra) return;
    const cardapio = document.querySelector("#cardapio");

    if (!document.querySelector("#finded-container")) {
      findedContainerHTML = `<section id="finded-container">
    
                            <div class="fechar-finded-container"><img class="fechar-finded" src="images/excluir.png"/></div>
                            <p class="total-finded-text">Total de itens encontrados: <span class="total-finded-number"></span></p>
                            
                            <ul id="finded-list" class="options">
                            
                            </ul>
                          </section>`;
      cardapio.insertAdjacentHTML("beforebegin", findedContainerHTML);
      createFecharFindedContainer();
    }

    const totalFinded = document.querySelector(".total-finded-number");
    const findedList = document.querySelector("#finded-list");
    let findedPratos = [];

    for (let i = 0; i < menuData.length; i++) {
      if (palavra === toCleanString(menuData[i].name)) {
        findedPratos.push(menuData[i]);
      }
    }

    findedList.innerHTML = "";
    totalFinded.innerText = findedPratos.length;

    if (findedPratos.length !== 0) {
      for (let i = 0; i < findedPratos.length; i++) {
        findedList.innerHTML += yield createOptionsItem(findedPratos[i], menuData.indexOf(findedPratos[i]));
      }
    }
  });
  return _buscarNoCardapio.apply(this, arguments);
}

function fechaFindedContainer() {
  const findedContainer = document.querySelector("#finded-container");
  findedContainer.remove();
  document.querySelector(".buscar-no-cardapio").value = "";
}

function createFecharFindedContainer() {
  const fecharFindedButton = document.querySelector(".fechar-finded-container");
  fecharFindedButton.onclick = fechaFindedContainer;
} // MODAL //


function showModal(index) {
  const modalData = menuData[index];
  const modal = createModal(modalData);
  const header = document.querySelector("header");
  header.insertAdjacentHTML("beforebegin", modal);
  document.querySelector(".adicionar").addEventListener("click", () => {
    addToCart(modalData);
  });
}

function createModal(data) {
  return `<div class="modal-container">
              <div class="modal-content">
                  <button class="fechar-modal" onclick="fechaModal()">
                      <img class="icon-fechar"src="images/close_icon-icons.com_50420.png">
                  </button>
                      <img id="modal-image" src="${data.image}">
                  <p class="modal-nome">${data.name}</p>
                  <div class="flex-text">
                      <p class="modal-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <p class="modal-preco">R$ ${data.price.toFixed(2)}</p>
                  </div>
                  <div class="actions">
                      <div class="botoes-quantidade">
                          <div class="botao menos" onclick=changeQuantity("menos")>&ndash;</div>
                          <input type="text"  id="quantidade" value="1">
                          <div class="botao mais" onclick=changeQuantity("mais")>+</div>
                      </div>
                      <div class="adicionar">Adicionar<span class="span-preco">R$ ${data.price.toFixed(2)}</span></div>
                  </div>
              </div>
      </div>`;
}

function fechaModal() {
  const modal = document.querySelector(".modal-container");
  modal.remove();
}

function changeQuantity(operation) {
  const inputQuantidade = document.querySelector("#quantidade");
  const itemPreco = document.querySelector(".modal-preco");
  const spanPreco = document.querySelector(".span-preco");

  if (operation === "menos") {
    if (Number(inputQuantidade.value) - 1 < 1) return;
    inputQuantidade.value--;
  } else {
    if (Number(inputQuantidade.value) + 1 > 9999) return;
    inputQuantidade.value++;
  }

  const valor = itemPreco.innerText;
  let valorPreco = "";

  for (let i = 0; i < valor.length; i++) {
    if (valor[i] !== "R" && valor[i] !== "$" && valor[i] !== " ") {
      valorPreco += valor[i];
    }
  }

  valorPreco = Number(valorPreco);
  spanPreco.innerText = "R$ " + (inputQuantidade.value * valorPreco).toFixed(2);
} //carrinho//


function addToCart(data) {
  const quantidade = Number(document.querySelector("#quantidade").value);
  const key = Cart.items.findIndex(item => item.prato.name === data.name);

  if (key !== -1) {
    Cart.items[key].quantidade += quantidade;
  } else {
    const pedido = {
      identifier: identificador,
      prato: data,
      quantidade: quantidade
    };
    Cart.items.push(pedido);
  }

  fechaModal();
  renderCarrinho();
}

function renderCarrinho() {
  if (!Cart.items) return;
  let subtotal = 0;
  let desconto = 0.1;
  const subtotalElement = document.querySelector(".subtotal-value");
  const descontoElement = document.querySelector(".desconto-value");
  const totalElement = document.querySelector(".total-value");
  const carrinhoElement = document.querySelector(".carrinho-items");
  carrinhoElement.innerHTML = "";

  for (let i = 0; i < Cart.items.length; i++) {
    carrinhoElement.innerHTML += `<div class="cart-item">
                            <img class="cart-item-image" src="${Cart.items[i].prato.image}">
                            <p class="cart-item-name">${Cart.items[i].prato.name}</p>
                            <span class="cart-item-preco">R$${Cart.items[i].prato.price.toFixed(2)}</span>
                            <span class="cart-item-quantidade">x${Cart.items[i].quantidade}</span>
                        </div>`;
    subtotal += Cart.items[i].quantidade * Cart.items[i].prato.price;
  }

  Cart.total = subtotal - subtotal * desconto;
  subtotalElement.innerHTML = "R$" + subtotal.toFixed(2);
  totalElement.innerHTML = "R$" + Cart.total.toFixed(2);
  descontoElement.innerHTML = "R$" + (subtotal * desconto).toFixed(2);
}

document.querySelector(".limpar").addEventListener("click", () => {
  Cart.items = [];
  renderCarrinho();
}); //chamadas//

renderPage();
