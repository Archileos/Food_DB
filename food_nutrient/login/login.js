$(document).ready(function () {

    $('#login-form-submit').on('click', function (event) {
        event.preventDefault()
        let username = $('#username-field').val()
        let data = {username: username, password: $('#password-field').val()}
        $.ajax({
            url: 'http://localhost:8080/login',
            method: 'post',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                localStorage["user"] = username;
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