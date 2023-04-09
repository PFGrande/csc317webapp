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
        if (name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57) {
            count++;
        }
    }


    return count;


}

const specialChars = ['/', '*', '-', '+', '!', '@', '#', '$', '^', '&', '~', '[', ']'];

function validatePassword(password) {
    let missingCriteria = "Password requirements:";


    if (hasSpace(password) === true) {
        missingCriteria += "\nmust not include spaces";
    }

    if (password.length < 8) {
        missingCriteria += "\nmust contain 8 characters"
    }

    if (hasUppercase(password) === false) {
        missingCriteria += "\nmust contain at least one uppercase";
    }

    if (hasNumber(password) === false) {
        missingCriteria += "\nmust contain at least one number";
    }

    if (hasSpecialChar(password) === false) {
        missingCriteria += "\nmust contain at least one special character: / * - + ! @ # $ ^ & ~ [ ]"
    }


    alert(missingCriteria);




}

function hasSpecialChar(inputString) {
    for(let i = 0; i < inputString.length; i++) {
        //find returns -1 if value is not found in a string
        if (inputString.find(specialChars[i]) >= 0) {
            return true;
        }
    }
    return false;
}
function hasUppercase(inputString) {
    for(let i = 0; i < inputString.length; i++) {
        if (inputString.charCodeAt(i) >= 65 && inputString.charCodeAt(i) <= 90) {
            return true;
        }
    }
    return false;

}
//count numerical characters in a string

function hasNumber(inputString) {
    for(let i = 0; i < inputString.length; i++) {
        if (inputString.charCodeAt(i) >= 48 && inputString.charCodeAt(i) <= 57) {
            return true;
        }
    }
    return false;
}

//checks if there are any spaces in the string
function hasSpace (inputString) {
    for(let i = 0; i < inputString.length; ) {
        if (inputString.charCodeAt(i) === 32) {
            return true;
        }
    }
    return false;
}