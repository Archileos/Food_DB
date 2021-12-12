$(document).ready(function () {

    $('#login-form-submit').on('click', function (event) {
        event.preventDefault()
        if ($('#username-field').val() === "user" && $('#password-field').val() === "web_dev") {
            window.location.href="http://localhost:8080/diets.html";
        } else {
            $('#login-error-msg-wrong-first').css('opacity', '1')
        }
    })

    $('#register-form-submit').on('click', function () {
        window.location.href="http://localhost:8080/register.html";
    })
});