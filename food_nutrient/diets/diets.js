$(document).ready(function () {

    $('#create_diet_button').on('click', function () {
        window.location.href="http://localhost:8080/comoBOX.html";
    })

    $('#table tr').click(function () {
        let value = ""
        $(this).children('td').each(function () {
            value += $(this).html() + " "
        })
        alert(value);
    });
});