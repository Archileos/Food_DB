$(document).ready(function () {
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
        }
        else {
            $('#login-error-msg-wrong-first').css('opacity', '1')
        }
    })
});