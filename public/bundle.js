function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let listaRestaurantes;
const restaurantSection = document.querySelector("#restaurant-container");
const inputSearch = document.querySelector("#search");
const botaoBuscar = document.querySelector("#buscar");

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

function loadRestaurants() {
  return _loadRestaurants.apply(this, arguments);
}

function _loadRestaurants() {
  _loadRestaurants = _asyncToGenerator(function* () {
    data = yield getRestaurants();
    document.querySelector("#loading").remove();
    renderRestaurants(data);
  });
  return _loadRestaurants.apply(this, arguments);
}

function createRestaurantCard(_x) {
  return _createRestaurantCard.apply(this, arguments);
}

function _createRestaurantCard() {
  _createRestaurantCard = _asyncToGenerator(function* (restaurant) {
    return `<a  href="restaurante.html?restaurante=${restaurant.id}" class="restaurant-status">
  <div class="status fechado">STATUS</div>

    <div class="restaurant">
        <img class="restaurant-image" src=${restaurant.image}>
        <p class="restaurant-name">${restaurant.name}</p>
        <p class="restaurant-address">${restaurant.address}</p>
    </div>
  </a>`;
  });
  return _createRestaurantCard.apply(this, arguments);
}

function renderRestaurants(_x2) {
  return _renderRestaurants.apply(this, arguments);
}

function _renderRestaurants() {
  _renderRestaurants = _asyncToGenerator(function* (data) {
    // restaurantSection.innerHTML=""
    for (let i = 0; i < data.length; i++) {
      restaurantSection.innerHTML += yield createRestaurantCard(data[i]);
    }
  });
  return _renderRestaurants.apply(this, arguments);
}

function toCleanString(string) {
  return retiraEspacos(string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function retiraEspacos(string) {
  newString = "";

  for (let i = 0; i < string.length; i++) {
    if (string[i] !== " ") {
      newString += string[i];
    }
  }

  return newString;
}

function search() {
  const palavra = toCleanString(inputSearch.value);
  console.log("palavra= ", palavra);
  console.log("'palavra' limpa= ", palavra);
  let findedRestaurants = [];

  for (let i = 0; i < listaRestaurantes.length; i++) {
    if (palavra === toCleanString(listaRestaurantes[i].name)) {
      // console.log("nome do restaurante ",listaRestaurantes[i].name)
      // console.log("nome do restaurante limpo= ",toCleanString(listaRestaurantes[i].name))
      findedRestaurants.push(listaRestaurantes[i]);
    }
  }

  if (findedRestaurants.length === 0) {
    putErrorElement();
    console.log("nenhum encontrado");
  } else {
    renderRestaurants(findedRestaurants);
  }
}

function putLoading() {
  restaurantSection.innerHTML = "";
  const loadingElement = `<div id="loading"></div>`;
  restaurantSection.insertAdjacentHTML('afterbegin', loadingElement);
}

function putErrorElement() {
  restaurantSection.innerHTML = "";
  const errorElement = `<div id="error">
        <img id="error-image" src="images/sad_4209.png">
        <p>Nenhum item encontrado</p>
        <a id="voltar" href="index.html">Voltar</a>
    </div>`;
  restaurantSection.insertAdjacentHTML('afterbegin', errorElement);
}

inputSearch.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    botaoBuscar.click();
  }
});
botaoBuscar.addEventListener("click", function () {
  putLoading();
  setTimeout(search, 100);
});
loadRestaurants();
