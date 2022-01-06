// This file handles all the backend code of the login screen.
$(document).ready(function () {

    /*
     * This code is present at the start of every js file, and is intended to handle loading.
     */
    $(document).ajaxStart(function () {
        $(document.body).css({'cursor': 'wait'});
        $(document.body).prepend($("<div id=\"loading-overlay\">"));
    }).ajaxStop(function () {
        $(document.body).css({'cursor': 'default'});
        $(document.body).find("#loading-overlay").remove();
    });

    /*
    * This batch handles logging in, it verifies if the user is present in the database via a post request and if
    * everything is okay, the user is redirected to the diets screen, otherwise the user will receive an error message.
    */
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

    // On click on the register button, the user is redirected to register screen.
    $('#register-form-submit').on('click', function () {
        window.location.href="http://localhost:8080/register.html";
    })
});