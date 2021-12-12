$(document).ready(function () {
    $('#register-form-submit').on('click', function (event) {
        event.preventDefault()
        window.location.href="http://localhost:8080/diets.html";
    })
});