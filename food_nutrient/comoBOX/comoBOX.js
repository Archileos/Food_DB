$(document).ready(function () {

    $('#done_button').on('click', function () {
        $("#table").css('visibility', 'visible')
        $.ajax({
            url: 'http://localhost:8080/list',
            method: 'get',
            success: function (data) {
                if (data.length > 0) {
                    for (let index = 0; index < data.length; index++) {
                        const newRow = $("<tr>");
                        newRow.append('<td> ' + data[index].food_name + '</td>');
                        newRow.append('<td> ' + data[index].amount + '</td>');
                        $("#table .tbody").append(newRow);
                    }
                }
            },
            error: function () {
                alert('failed')
            }
        })
    })

    $('#table tr').click(function () {
        let value = ""
        $(this).children('td').each(function () {
            value += $(this).html() + " "
        })
        alert(value);
    });
});

