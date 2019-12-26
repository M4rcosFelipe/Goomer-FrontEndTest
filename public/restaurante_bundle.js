function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getId() {
  const id = location.search[location.search.indexOf("=") + 1];
  return id;
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
    const id = getId();
    const response = yield fetch(`https://challange.goomer.com.br/restaurants/${id}/menu`);
    const data = yield response.json();
    console.log(data);
    return data;
  });
  return _getMenu.apply(this, arguments);
}

function getHeader() {
  return _getHeader.apply(this, arguments);
}

function _getHeader() {
  _getHeader = _asyncToGenerator(function* () {
    const restaurantes = yield getRestaurants();
    const id = getId();
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

function loadPage() {
  return _loadPage.apply(this, arguments);
}

function _loadPage() {
  _loadPage = _asyncToGenerator(function* () {
    const pageHeader = document.querySelector(".restaurant-data");
    pageHeader.innerHTML = yield createHeader();
    yield createMenu();
  });
  return _loadPage.apply(this, arguments);
}

function createMenu() {
  return _createMenu.apply(this, arguments);
}

function _createMenu() {
  _createMenu = _asyncToGenerator(function* () {});
  return _createMenu.apply(this, arguments);
}

function createCardapioItems(item) {
  `<li class="cardapio-item ${item.group}"> 
        <label for="almoco-options" id="cardapio-label">Almoços</label>
        <input type="checkbox" class="checkbox-input" id="almoco-options">

        <ul class="options">
        </ul>
    </li>`;
}

function createMenuOptionsItem(item) {
  return ` <li class="menu-item">
                <img class="prato-image" src="${item.image}">
                <div class="prato-wrapper">
                    <div class="name-wrapper">                         
                        <h1 class="prato-name">${item.name}</h1>

                        <div class="promo">
                            <img class="logo-promo" src="./images/award.svg"/>
                            Promo Almoço
                        </div>
                    </div>  
                    <p class="prato-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
            
                    <div class="preco">
                        <p>R$${item.price}</p><strike>R$19,90</strike>
                    </div>
                </div>
            </li>`;
}

function createHeader() {
  return _createHeader.apply(this, arguments);
}

function _createHeader() {
  _createHeader = _asyncToGenerator(function* () {
    const header = yield getHeader();
    return `<img class="restaurant--image"src="${header.image}">

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

loadPage();
