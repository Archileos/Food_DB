$(document).ready(function () {
    $('#register-form-submit').on('click', function (event) {
        event.preventDefault()
        let password = $('#password-field').val()
        if (password === $('#password-field1').val()) {
            let data = {username: $('#username-field').val(), password: password}
            $.ajax({
                url: 'http://localhost:8080/register',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function () {
                    window.location.href = "http://localhost:8080/";
                },
                error: function () {
                    $('#login-error-msg-wrong-first').css('opacity', '1')
                }
            })
        }
        else {
            $('#login-error-msg-wrong-first').css('opacity', '1')
        }
    })
});