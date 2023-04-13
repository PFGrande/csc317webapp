const postsDataURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
console.log(fetchWithJSON())
async function fetchWithJSON() {//async function creates promise
    try {
        let response = await fetch(postsDataURL); //fetch returns promise, wait for promise resolution before continuing in code
        let data = await response.json(); //converts data to JavaScript object
        let elements = data.map(buildCard);
        document.getElementById("posts-grid").append(...elements);
        //console.log(elements.length); length of array = number of cards
    } catch (err) { //promise rejected
        console.log("error: " + err); //prints error in console
    }
}

function buildCard(data) {
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card-div");

    let cardImg = document.createElement("img");
    cardImg.setAttribute("class","card-img");
    cardImg.setAttribute("src",data.thumbnailUrl);

    let cardDesc = document.createElement('div');
    cardDesc.setAttribute('class','card-desc');

    let cardTitle = document.createElement("h1");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.appendChild(document.createTextNode(data.title));

    /*let cardUrl = document.createElement("a");
    cardUrl.setAttribute("href", "card-url");
    cardUrl.appendChild(document.createTextNode(data.url));*/

    cardDiv.appendChild(cardDesc);
    cardDesc.appendChild(cardTitle);
    cardDesc.appendChild(cardImg);
    //cardDesc.appendChild(cardUrl);

    //cardDiv.addEventListener('click', fadeOut);

    return cardDiv;

}