$(document).ready(function () {

    $('#create_diet_button').on('click', function () {
        window.location.href="http://localhost:8080/comoBOX.html";
    })

    $('#table tr').click(function () {
        $("#table3").css('visibility', 'visible')
        let value = ""
        $(this).children('td').each(function () {
            value += $(this).html() + " "
        })
        $('#table tr').each(function () {
            $(this).css('backgroundColor', '')
            $(this).removeClass('selected');
        })
        $(this).css('backgroundColor', 'yellow')
        $(this).addClass('selected');
        alert(value);
    });
});