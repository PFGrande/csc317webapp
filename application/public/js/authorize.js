/*document.addEventListener('DOMContentLoaded', function (ev){
    console.log("The body has been loaded");
});*/
let usernameField = document.getElementById('reg-username');

usernameField.addEventListener('change', function (usernameInput) {
    console.log(usernameInput.currentTarget.value);
    validateUsername(usernameInput);
});

function validateUsername(username) {
    console.log(username.currentTarget.value);
}