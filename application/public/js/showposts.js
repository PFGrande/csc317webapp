const postsDataURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
async function fetchWithJSON() {//async function creates promise
    try {
        let response = await fetch(postsDataURL); //fetch returns promise, wait for promise resolution before continuing in code
        let data = await response.json(); //converts data to JavaScript object
        let elements = data.map(buildCard);
    } catch (err) { //promise rejected
        console.log(err); //prints error in console
    }
}

function buildCard(data) {
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card-div");

    let cardImg = document.createElement("img");
    cardImg.setAttribute("class","card-img");
    cardImg.setAttribute("src","data.thumbnailUrl");

    let cardInfo = document.createElement('div');
    cardInfo.setAttribute('class','card-desc');

    let cardTitle = document.createElement("h1");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.appendChild(document.createTextNode(data.title));

    let cardUrl = document.createElement("a");
    cardUrl.setAttribute("href", "card-url");
    cardUrl.appendChild(document.createTextNode(data.url));

    cardDiv.appendChild(cardInfo);
    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(cardImg);
    cardInfo.appendChild(cardUrl);

    //cardDiv.addEventListener('click', fadeOut);

    return cardDiv;

}