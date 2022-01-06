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
    * This batch of code verifies the login, it checks if the passwords are matching and that all the fields are filled,
    * then the code will verify whatever or not a user with a similar name already exists. If such a user doesn't exist
    * the user will be redirected back to the login screen, otherwise, they'll get an appropriate error message.
    */
    $('#register-form-submit').on('click', function (event) {
        event.preventDefault()
        let password = $('#password-field').val()
        let confirm_password = $('#password-field1').val();
        let username = $('#username-field').val()
        if (password === confirm_password && password !== '' && confirm_password !== '' && username !== '') {
            let data = {username: username, password: password}
            $.ajax({
                url: 'http://localhost:8080/register',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function () {
                    window.location.href = "http://localhost:8080/";
                },
                error: function () {
                    $('#login-error-msg-wrong-first2').css('opacity', '1')
                }
            })
        } else {
            $('#login-error-msg-wrong-first').css('opacity', '1')
        }
    })
});