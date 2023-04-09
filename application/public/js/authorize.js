/*document.addEventListener('DOMContentLoaded', function (ev){
    console.log("The body has been loaded");
});*/
let usernameField = document.getElementById('reg-username');

usernameField.addEventListener('change', function (usernameInput) {
    //console.log(usernameInput.currentTarget.value);
    validateUsername(usernameInput.currentTarget.value);

});

//might make it return boolean or display a list of invalid stuff
function validateUsername(username) {
    let missingCriteria = "Username requirements:";
    //console.log(username);
    console.log(username.charCodeAt(0))
    if (username.toUpperCase().charCodeAt(0) < 65 || username.toUpperCase().charCodeAt(0) > 90) {
        //console.log("invalid username - must start with letters A-Z or a-z");
        missingCriteria += "\nstart with characters: A-Z or a-z";
    }

    let alphanumericCount = checkAlphanumeric(username);

    if (alphanumericCount < 3) {
        missingCriteria += "\nmust contain 3 or more alphanumeric characters"
    }

    if (missingCriteria !== "Username requirements:") {
        alert(missingCriteria)
    }
}

//Increments count if it is between numerical and alphabetic characters
function checkAlphanumeric (name) {
    let count = 0;

    for (let i = 0; i < name.length; i++) {
        if (name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57) {
            count++;
        } else if (name.toUpperCase().charCodeAt(i) >= 65 && name.toUpperCase().charCodeAt(i) <= 90) {
            count++;
        }
    }
    return count;


}