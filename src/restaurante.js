function getId(){
    const id=location.search[location.search.indexOf("=")+1]
    return id
}

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

    const id=getId()

    const response=await fetch(`https://challange.goomer.com.br/restaurants/${id}/menu`)
    const data=await response.json()
    console.log(data)
    return data
    
}



async function getHeader(){
    const restaurantes=await getRestaurants()
    
    const id=getId()

    let restauranteData=""

    for(let i=0;i<restaurantes.length;i++){

        if(restaurantes[i].id==id){
            restauranteData=restaurantes[i]
            return restauranteData
        }
    }
}


async function loadPage(){
    const pageHeader=document.querySelector(".restaurant-data")

    pageHeader.innerHTML=await createHeader()

    await createMenu()

   
}


async function createMenu(){

}




function createCardapioItems(item){


    `<li class="cardapio-item ${item.group}"> 
        <label for="almoco-options" id="cardapio-label">Almoços</label>
        <input type="checkbox" class="checkbox-input" id="almoco-options">

        <ul class="options">
        </ul>
    </li>`
}




function createMenuOptionsItem(item){
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
            </li>`
} 




async function createHeader(){

    const header=await getHeader()
    
    
    return `<img class="restaurant--image"src="${header.image}">

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




loadPage()









