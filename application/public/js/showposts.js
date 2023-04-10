const postsDataURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
async function fetchWithJSON() {//async function creates promise
    try {
        let response = await fetch(postsDataURL); //fetch returns promise, wait for promise resolution before continuing in code
        let data = await response.json(); //converts data to JavaScript object
        let elements = data.products
    } catch (err) {//promise rejected
        console.log(err);
    }
}