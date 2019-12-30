function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//variaveis globais
let groups = [];
let listaRestaurantes;
const DEFAULT_IMAGE = "../public/images/dish.png";
const DEFAULT_PRICE = 0;
const DEFAULT_PROMO = 0;
const RESTAURANT_ID = getId();
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
      horariosContent += `<p>${convertDias(restaurante.hours[j].days)}: <span class="horario">${restaurante.hours[j].from} às ${restaurante.hours[j].to}</span></p>`;
    }
  }

  return ` 
            <div class="horarios">
                ${horariosContent}
            </div>`;
}

function convertDias(lista) {
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return `${diasDaSemana[lista[0] - 1]} à ${diasDaSemana[lista[lista.length - 1] - 1]}`;
} //criando menu
//funções de data


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
  //verifica se é DIA de promoção
  const today = new Date(); //teste
  // today.setDate() 

  const diaAtual = today.getDay() + 1;
  console.log(`Dia atual: ${diaAtual}`);
  const isDay = dias.days.indexOf(diaAtual);
  return isDay !== -1 ? true : false;
}

function verificaHora(horas) {
  const from = converteHora(horas.from);
  const to = converteHora(horas.to);
  const now = new Date(); //teste
  // now.setHours()

  console.log(`Hora atual: ${now.getHours()}`);
  console.log(`from: ${from}`);
  console.log(`to: ${to}`);

  if (now.getHours() >= from && now.getHours() <= to) {
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
    isPromoDay = verificaDia(salesData.hours[i]); //verifica se é hora de promoção

    isPromoHour = verificaHora(salesData.hours[i]);

    if (isPromoHour && isPromoDay) {
      return true;
    }
  }

  return false;
} //


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

function createOptionsItem(data, index) {
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
    } else {
      menuItemData.pricePromo = DEFAULT_PROMO;
      menuItemData.promo = "";
    }
  } else {
    menuItemData.pricePromo = DEFAULT_PROMO;
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
                        <p>R$${menuItemData.price.toFixed(2)}</p><strike>R$${menuItemData.pricePromo.toFixed(2)}</strike>
                    </div>
                </div>
            </li>`;
  return item;
}

function createMenuOptionsContent(_x) {
  return _createMenuOptionsContent.apply(this, arguments);
} //renderizando input


function _createMenuOptionsContent() {
  _createMenuOptionsContent = _asyncToGenerator(function* (group) {
    let optionsData = "";

    for (let i = 0; i < menuData.length; i++) {
      const menuItemData = menuData[i];

      if (toCleanString(menuItemData.group) === toCleanString(group)) {
        optionsData += createOptionsItem(menuItemData, i);
      }
    }

    return optionsData;
  });
  return _createMenuOptionsContent.apply(this, arguments);
}

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
      findedList.innerHTML += createOptionsItem(findedPratos[i], menuData.indexOf(findedPratos[i]));
    }
  }
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
} //chamadas//


renderPage();
