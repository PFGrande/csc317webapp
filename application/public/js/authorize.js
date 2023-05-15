let submissionStatus = [false, false, false]; //username, password, conPassword

let usernameField = document.getElementById('reg-username');

usernameField.addEventListener('change', function (usernameInput) {
    if (validateUsername(usernameInput.currentTarget.value) === false) {
        submissionStatus[0] = false;
    } else {
        submissionStatus[0] = true;
    }

});

let passwordField = document.getElementById('reg-pass');
let conPasswordField = document.getElementById('reg-cPass');
let password;

passwordField.addEventListener('change', function (passwordInput) {
    if (validatePassword(passwordInput.currentTarget.value) === false) {
        submissionStatus[1] = false;
    } else {
        submissionStatus[1] = true;
    }
    password = passwordInput.currentTarget.value;
});

conPasswordField.addEventListener('change', function (conPasswordInput) {
    if (conPasswordInput.currentTarget.value !== password) {
        //console.log("===================passwords do not match===================")
        submissionStatus[2] = false;
    } else {
        submissionStatus[2] = true;
    }
});

let regForm = document.getElementById('reg-submit');
regForm.addEventListener('click', function (buttonPress) {
   //buttonPress.preventDefault();
    //removed alerts because they are misleading. They occur before the databse checks leading the
    //user to believe their account has been created before checking for duplicates in the DB.
   if (formValidation() === true) {
       //alert("successful submission :)");
       //console.log("===============form valid==================")
       //location.reload();
   } else {
       //console.log("====================form can not be submitted, check form requirements===============");
   }

});

function formValidation() {
    for (let i = 0; i < submissionStatus.length; i++) {
        if (submissionStatus[i] === false) {
            return false;
        }
    }

    //if 1 or no checkboxes is checked, form is false. Statement is used to show reason why form can not be accepted.
    if (!document.getElementById('policy-confirmation').checked || !document.getElementById('age-confirmation').checked) {
        alert("User did not accept the terms of service");
        return false;
    }

    return true;
}

//might make it return boolean or display a list of invalid stuff
function validateUsername(username) {
    let missingCriteria = "Username requirements:";

    if (username.toUpperCase().charCodeAt(0) < 65 || username.toUpperCase().charCodeAt(0) > 90) {
        //console.log("invalid username - must start with letters A-Z or a-z");
        missingCriteria += "\nstart with characters: A-Z or a-z";
    }

    let alphanumericCount = checkAlphanumeric(username);

    if (alphanumericCount < 3) {
        missingCriteria += "\nmust contain 3 or more alphanumeric characters"
    }

    if (missingCriteria !== "Username requirements:") {
        alert(missingCriteria);
        return false;
    } else {
        return true;
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

const specialChars = ['\\/', '\\*', '\\-', '\\+', '\\!', '\\@', '\\#', '\\$', '\\^', '\\&', '\\~', '\\[', '\\]'];

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

    if (missingCriteria !== "Password requirements:") {
        alert(missingCriteria);
        return false; //password is invalid
    } else {
        return true; //password is valid
    }

}

function hasSpecialChar(inputString) {
    for(let i = 0; i < specialChars.length; i++) {
        //find returns -1 if value is not found in a string
        if (inputString.search(specialChars[i]) >= 0) {
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
    for(let i = 0; i <= inputString.length; i++) {
        if (inputString.charCodeAt(i) === 32) {
            return true;
        }
    }
    return false;
}