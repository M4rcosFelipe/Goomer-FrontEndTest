//variaveis globais

let groups=[]
let listaRestaurantes
const DEFAULT_IMAGE="../public/images/dish.png"
const DEFAULT_PRICE=0
const DEFAULT_PROMO=0
const RESTAURANT_ID=getId()

var menuData=""

function getId(){
    const id=location.search[location.search.indexOf("=")+1]
    return id
}


async function setMenuData(){
    const resposta=await getMenu()
    menuData=resposta

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
        const label=document.querySelector("."+toCleanString(groups[i]))
        label.innerHTML=await createMenuOptionsItems(groups[i])
    }
}




async function createMenuOptionsItems(group){

    let optionsData=""

    for(let j=0;j<menuData.length;j++){

        const menuItemData={}=menuData[j]

        if(toCleanString(menuItemData.group)===toCleanString(group)){



            if(!menuItemData.price) {menuItemData.price=DEFAULT_PRICE}
            if(!menuItemData.image) {menuItemData.image=DEFAULT_IMAGE}
            if(!menuItemData.promo){menuItemData.promo=DEFAULT_PROMO}
            if(menuItemData.sales){
                //if(é dia de promo){

                menuItemData.promo=`<div class="promo">
                                        <img class="logo-promo" src="./images/award.svg"/>
                                        Promo Almoço
                                    </div>`;
                                    menuItemData.pricePromo=menuItemData.sales[0].price
                                
                            //}
                        }else{
                                    menuItemData.pricePromo=DEFAULT_PROMO
                                    menuItemData.promo=""
                                }
                                console.log(menuItemData)


            optionsData+= ` <li class="menu-item" onclick="showModal(${j})">
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
                    </li>`
        }
    }
    return optionsData
}


/* <div class="promo">
<img class="logo-promo" src="./images/award.svg"/>
Promo Almoço
</div> */


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

// MODAL //


function showModal(index){
    
    const modalData=menuData[index]
    const modal=createModal(modalData)
    const header=document.querySelector("header")
    header.insertAdjacentHTML("beforebegin",modal)

}

function createModal(data){

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
</div>`
}


function fechaModal(){
    const modal=document.querySelector(".modal-container")
    modal.remove()
}




function changeQuantity(operation){
    const inputQuantidade=document.querySelector("#quantidade")
    const itemPreco=document.querySelector(".modal-preco")
    const spanPreco=document.querySelector(".span-preco")


    if(operation==="menos"){
        if(Number(inputQuantidade.value)-1<1) return

        inputQuantidade.value--
    }else{
        if(Number(inputQuantidade.value)+1>9999) return

        inputQuantidade.value++
    }

    const valor=itemPreco.innerText

    let valorPreco=""

    for(let i=0;i<valor.length;i++){
        if(valor[i]!=="R" && valor[i]!=="$" && valor[i]!==" "){
            valorPreco+=valor[i]
        }
    }
    valorPreco=Number(valorPreco)


    spanPreco.innerText="R$ "+(inputQuantidade.value*valorPreco).toFixed(2)

}


//chamadas//

    


renderPage()









