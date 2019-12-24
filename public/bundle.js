function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getRestaurants() {
  return _getRestaurants.apply(this, arguments);
}

function _getRestaurants() {
  _getRestaurants = _asyncToGenerator(function* () {
    try {
      const response = yield fetch("https://challange.goomer.com.br/restaurants");
      const data = yield response.json();
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
    return `<a href="#" class="restaurant-status">
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
    const restaurantSection = document.querySelector("#restaurant-container");

    for (let i = 0; i < data.length; i++) {
      restaurantSection.innerHTML += yield createRestaurantCard(data[i]);
    }
  });
  return _renderRestaurants.apply(this, arguments);
}

loadRestaurants();
