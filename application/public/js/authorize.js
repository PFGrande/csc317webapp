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
    console.log(username);
    console.log(username.charCodeAt(0))
    if (username.toUpperCase().charCodeAt(0) < 65 || username.toUpperCase().charCodeAt(0) > 90) {
        console.log("invalid username - must start with letters A-Z or a-z");
    }
}