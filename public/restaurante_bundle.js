function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//variaveis globais
let groups = [];
let listaRestaurantes;
const DEFAULT_IMAGE = "../public/images/dish.png";
const DEFAULT_PRICE = "0.0";
const DEFAULT_PROMO = "0.0";
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
    console.log("menuData em 'setMenuData': ", menuData);
    const resposta = yield getMenu();
    menuData = resposta;
    console.log("menuData em 'setMenuData' apos atribuição: ", menuData);
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
  newString = "";

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
} //criando menu


function _createHeader() {
  _createHeader = _asyncToGenerator(function* () {
    const header = yield getHeader();
    const pageHeader = document.querySelector(".restaurant-data");
    pageHeader.innerHTML = `<img class="restaurant--image"src="${header.image}">

            <div class="wrapper">
                <h1 class="restaurant--name">${header.name}</h1>
                <p class="restaurant-description">${header.address}</p>
                
                <div class="horarios">
                    <p>Segunda à sexta: <span class="horario">11:30 às 15:00</span></p>
                    <p>Sábados: <span class="horario">11:30 às 22:00</span></p>
                    <p>Domingos e feriados :<span class="horario">11:30 às 15:00</span></p>
                </div>

            </div>`;
  });
  return _createHeader.apply(this, arguments);
}

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
    console.log("menuData em createMenuLabels= ", menuData);

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
      console.log(groups.length);
      const label = document.querySelector("." + toCleanString(groups[i]));
      label.innerHTML += yield createMenuOptionsItem(groups[i]);
    }
  });
  return _createMenuOptions.apply(this, arguments);
}

function createMenuOptionsItem(_x) {
  return _createMenuOptionsItem.apply(this, arguments);
} //renderizando input


function _createMenuOptionsItem() {
  _createMenuOptionsItem = _asyncToGenerator(function* (group) {
    for (let j = 0; j < menuData.length; j++) {
      if (toCleanString(menuData[j].group) === toCleanString(group)) {
        if (!menuData[j].price) {
          menuData[j].price = DEFAULT_PRICE;
        }

        if (!menuData[j].image) {
          menuData[j].image = DEFAULT_IMAGE;
        }

        if (!menuData[j].promo) {
          menuData[j].promo = DEFAULT_PROMO;
        }

        return ` <li class="menu-item">
                        <img class="prato-image" src="${menuData[j].image}">
                        <div class="prato-wrapper">
                            <div class="name-wrapper">                         
                                <h1 class="prato-name">${menuData[j].name}</h1>

                                <div class="promo">
                                    <img class="logo-promo" src="./images/award.svg"/>
                                    Promo Almoço
                                </div>
                            </div>  
                            <p class="prato-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                    
                            <div class="preco">
                                <p>R$${menuData[j].price}</p><strike>R$${menuData[j].promo}</strike>
                            </div>
                        </div>
                    </li>`;
      }
    }
  });
  return _createMenuOptionsItem.apply(this, arguments);
}

function renderInputSearch() {
  const header = document.querySelector(".restaurant-data");
  const input = `<form class="form-search">
    <label><span class="search-span">Buscar no Cardápio</span><input class="buscar-no-cardapio" type="text"/></label>
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
  const searchButton = document.querySelector("#search-button");
  searchButton.addEventListener("click", function () {
    console.log("deu certo");
  });
  const inputCardapio = document.querySelector(".buscar-no-cardapio");
  inputCardapio.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      searchButton.click();
    }
  });
} //chamadas//


renderPage();
