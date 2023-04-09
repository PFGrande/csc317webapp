/*document.addEventListener('DOMContentLoaded', function (ev){
    console.log("The body has been loaded");
});*/
let usernameField = document.getElementById('reg-username');

usernameField.addEventListener('change', function (usernameInput) {
    //console.log(usernameInput.currentTarget.value);
    validateUsername(usernameInput.currentTarget.value);

});

let passwordField = document.getElementById('reg-pass');
let conPasswordField = document.getElementById('reg-cPass');

passwordField.addEventListener('change', function (passwordInput) {
    validatePassword(passwordInput.currentTarget.value);
})

//might make it return boolean or display a list of invalid stuff
function validateUsername(username) {
    let missingCriteria = "Username requirements:";
    //console.log(username);
    //console.log(username.charCodeAt(0))
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
        if (name.toUpperCase().charCodeAt(i) >= 65 && name.toUpperCase().charCodeAt(i) <= 90) {
            count++;
        }
    }


    return count + countNumber(name);//adds numerical characters in string to alphabetic characters in string


}

function validatePassword(password) {
    let missingCriteria = "Password requirements:";

    if (hasSpace(password) === true) {
        missingCriteria += "\nmust not include spaces";
    }

    if (password.length < 8) {
        missingCriteria += "\nmust contain 8 characters"
    }

    for (let i = 0; i < password.length; i++) {
        if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {

        }
    }





}

function countUppercase(inputString) {
    let uppercaseCount = 0;
    for(let i = 0; i < inputString.length; i++) {
        if (inputString.charCodeAt(i) >= 65 && inputString.charCodeAt(i) <= 90) {
            uppercaseCount++;
        }
    }
    return uppercaseCount;

}
//count numerical characters in a string
function countNumber(inputString) {
    let numberCount = 0;
    for(let i = 0; i < inputString.length; i++) {
        if (inputString.charCodeAt(i) >= 48 && inputString.charCodeAt(i) <= 57) {
            numberCount++;
        }
    }

    return numberCount;
}

//checks if there are any spaces in the string
function hasSpace (inputString) {
    for(let i = 0; i < inputString.length; ) {
        if (inputString.charCodeAt(i) === 32) {
            return true;
        }
    }
}