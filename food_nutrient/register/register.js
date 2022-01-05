$(document).ready(function () {

    $(document).ajaxStart(function () {
        $(document.body).css({'cursor': 'wait'});
        $(document.body).prepend($("<div id=\"loading-overlay\">"));
    }).ajaxStop(function () {
        $(document.body).css({'cursor': 'default'});
        $(document.body).find("#loading-overlay").remove();
    });

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