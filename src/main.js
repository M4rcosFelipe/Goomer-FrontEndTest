let listaRestaurantes

const restaurantSection=document.querySelector("#restaurant-container")
const inputSearch=document.querySelector("#search")
const botaoBuscar=document.querySelector("#buscar")


async function getRestaurants(){
  try{
    const response=await fetch("https://challange.goomer.com.br/restaurants")
    const data=await response.json()
    listaRestaurantes=data
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


function isOpen(restaurante){
  
}


async function createRestaurantCard(restaurant){

  const status=isOpen(restaurant)

  return `<a  href="restaurante.html?restaurante=${restaurant.id}" class="restaurant-status">
  <div class="status fechado">STATUS</div>

    <div class="restaurant">
        <img class="restaurant-image" src=${restaurant.image}>
        <p class="restaurant-name">${restaurant.name}</p>
        <p class="restaurant-address">${restaurant.address}</p>
    </div>
  </a>`

}


async function renderRestaurants(data){

  // restaurantSection.innerHTML=""


  for(let i=0;i<data.length;i++){
    restaurantSection.innerHTML+=await createRestaurantCard(data[i])
  }
  
}




function toCleanString(string){

  return retiraEspacos(string)
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g,"")
                
}


function retiraEspacos(string){
  newString=""
  for(let i=0;i<string.length;i++){
    if(string[i]!==" "){
      newString+=string[i]
    }
  }
  return newString
}


function search(){

  const palavra=toCleanString(inputSearch.value)
  console.log("palavra= ",palavra)
  console.log("'palavra' limpa= ",palavra)

  let findedRestaurants=[]

  for(let i=0;i<listaRestaurantes.length;i++){
   
    if(palavra === toCleanString(listaRestaurantes[i].name)){

      // console.log("nome do restaurante ",listaRestaurantes[i].name)
      // console.log("nome do restaurante limpo= ",toCleanString(listaRestaurantes[i].name))

      findedRestaurants.push(listaRestaurantes[i])
    }
    
  }

  if(findedRestaurants.length===0){
    putErrorElement()
    console.log("nenhum encontrado")
  }else{
    renderRestaurants(findedRestaurants)
  }
}


function putLoading(){
  
  restaurantSection.innerHTML=""

  const loadingElement=`<div id="loading"></div>`

  restaurantSection.insertAdjacentHTML('afterbegin',loadingElement)

}

function putErrorElement(){

  
  restaurantSection.innerHTML=""

  const errorElement=`<div id="error">
        <img id="error-image" src="images/sad_4209.png">
        <p>Nenhum item encontrado</p>
        <a id="voltar" href="index.html">Voltar</a>
    </div>`

  restaurantSection.insertAdjacentHTML('afterbegin',errorElement)
}



inputSearch.addEventListener("keyup",function(event){
  if(event.keyCode===13){
    event.preventDefault()
    botaoBuscar.click()
  }
})

botaoBuscar.addEventListener("click",function(){
  putLoading()
  setTimeout(search,100)
})

loadRestaurants()

