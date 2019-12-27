//variaveis globais

let groups=[]
let listaRestaurantes
const DEFAULT_IMAGE="../public/images/dish.png"
const DEFAULT_PRICE="0.0"
const DEFAULT_PROMO="0.0"
const RESTAURANT_ID=getId()

var menuData=""

function getId(){
    const id=location.search[location.search.indexOf("=")+1]
    return id
}


async function setMenuData(){
    console.log("menuData em 'setMenuData': ",menuData)
    const resposta=await getMenu()
    menuData=resposta
    console.log("menuData em 'setMenuData' apos atribuição: ",menuData)

}

//funções de requisição

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

async function getMenu(){

    const id=RESTAURANT_ID

    const response=await fetch(`https://challange.goomer.com.br/restaurants/${id}/menu`)
    const data=await response.json()
    return data
    
}


async function getHeader(){
    const restaurantes=await getRestaurants()
    
    const id=RESTAURANT_ID

    let restauranteData=""

    for(let i=0;i<restaurantes.length;i++){

        if(restaurantes[i].id==id){
            restauranteData=restaurantes[i]
            return restauranteData
        }
    }
}

//funções uteis

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
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

function toCleanString(string){

    return retiraEspacos(string)
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g,"")
                  
}



//criando header

async function createHeader(){

    const header=await getHeader()
    const pageHeader=document.querySelector(".restaurant-data")

    
    
    pageHeader.innerHTML=`<img class="restaurant--image"src="${header.image}">

            <div class="wrapper">
                <h1 class="restaurant--name">${header.name}</h1>
                <p class="restaurant-description">${header.address}</p>
                
                <div class="horarios">
                    <p>Segunda à sexta: <span class="horario">11:30 às 15:00</span></p>
                    <p>Sábados: <span class="horario">11:30 às 22:00</span></p>
                    <p>Domingos e feriados :<span class="horario">11:30 às 15:00</span></p>
                </div>

            </div>` 
}

//criando menu

async function createMenu(){
    const cardapio=document.querySelector("#cardapio")

    cardapio.innerHTML=await createMenuLabels()

    await createMenuOptions()

}





async function createMenuLabels(){

console.log("menuData em createMenuLabels= ",menuData)

    for(let i=0;i<menuData.length;i++){
        if(groups.indexOf(capitalize(menuData[i].group))===-1){
            groups.push(capitalize(menuData[i].group))
        }
    }

    let labels=""

    for(let j=0;j<groups.length;j++){

      labels+= `<li class="cardapio-item "> 
                    <label for="${toCleanString(groups[j])}-options" id="cardapio-label">${groups[j]}</label>
                    <input type="checkbox" class="checkbox-input" id="${toCleanString(groups[j])}-options">

                    <ul class="options ${toCleanString(groups[j])}">

                    </ul>
                </li>`

    }

    return labels

}



async function createMenuOptions(){
    for(let i=0;i<groups.length;i++){
        console.log(groups.length)
        const label=document.querySelector("."+toCleanString(groups[i]))
        label.innerHTML+=await createMenuOptionsItem(groups[i])
    }
}




async function createMenuOptionsItem(group){

    for(let j=0;j<menuData.length;j++){

        if(toCleanString(menuData[j].group)===toCleanString(group)){


            if(!menuData[j].price) {menuData[j].price=DEFAULT_PRICE}
            if(!menuData[j].image) {menuData[j].image=DEFAULT_IMAGE}
            if(!menuData[j].promo){menuData[j].promo=DEFAULT_PROMO}

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
                    </li>`
        }
    }
}

//renderizando input

function renderInputSearch(){
    const header=document.querySelector(".restaurant-data")
    const input=`<form class="form-search">
    <label><span class="search-span">Buscar no Cardápio</span><input class="buscar-no-cardapio" type="text"/></label>
</form>
<button id="search-button"></button>`
    header.insertAdjacentHTML("afterend",input)
}

//renderiza pagina

async function renderPage(){

    await setMenuData()

    await createHeader()

    renderInputSearch()

    await createMenu()

    document.querySelector("#loading").remove()

    createSearchEvent()

}


//mecanismo de busca//

function createSearchEvent(){

    const searchButton=document.querySelector("#search-button")

    searchButton.addEventListener("click",function(){
        console.log("deu certo")
    })

    const inputCardapio=document.querySelector(".buscar-no-cardapio")


    inputCardapio.addEventListener("keyup",function(event){
        if(event.keyCode===13){
            event.preventDefault()
            searchButton.click()
        }
    })
    
}







//chamadas//

    


renderPage()









