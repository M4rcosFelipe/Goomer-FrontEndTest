async function getRestaurants(){
  try{
    const response=await fetch("https://challange.goomer.com.br/restaurants")
    const data=await response.json()
    return data
  }catch(error){
    console.log("Fetch failed: ",error)
  }
}

async function loadRestaurants(){
  
  data=await getRestaurants()
  document.querySelector("#loading").remove()
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

loadRestaurants()

