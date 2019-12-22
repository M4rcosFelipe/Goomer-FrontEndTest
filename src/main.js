async function getRestaurants(){
  const response=await fetch("https://challange.goomer.com.br/restaurants")
  const data=await response.json()
  renderRestaurants(data)
}

async function createRestaurantCard(restaurant){

  return `<a href="#" class="restaurant-status">
    <div class="status fechado">STATUS</div>
    <div class="restaurant">
        <img class="restaurant-image" src=${restaurant.image}>
        <p class="restaurant-name">${restaurant.name}</p>
        <p class="restaurant-address">${restaurant.address}</p>
    </div>
  </a>`

}

async function renderRestaurants(data){

  const restaurantSection=document.querySelector("#restaurant-container")

  for(let i=0;i<data.length;i++){
    restaurantSection.innerHTML+=await createRestaurantCard(data[i])
  }
  
}

getRestaurants()