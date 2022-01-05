$(document).ready(function () {

    $(document).ajaxStart(function () {
        $(document.body).css({'cursor': 'wait'});
        $(document.body).prepend($("<div id=\"loading-overlay\">"));
    }).ajaxStop(function () {
        $(document.body).css({'cursor': 'default'});
        $(document.body).find("#loading-overlay").remove();
    });

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
                sessionStorage["user"] = username;
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