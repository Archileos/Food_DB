$(document).ready(function () {

    $('#login-form-submit').on('click', function (event) {
        event.preventDefault()
        let data = {username: $('#username-field').val(), password: $('#password-field').val()}
        $.ajax({
            url: 'http://localhost:8080/login',
            method: 'post',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                window.location.href="http://localhost:8080/diets.html";
            },
            error: function () {
                $('#login-error-msg-wrong-first').css('opacity', '1')
            }
        })
    })

    $('#register-form-submit').on('click', function () {
        window.location.href="http://localhost:8080/register.html";
    })
});