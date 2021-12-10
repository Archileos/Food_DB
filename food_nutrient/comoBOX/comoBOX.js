$(document).ready(function () {

    $('#done_button').on('click', function () {
        $("#table").css('visibility', 'visible')
        $.ajax({
            url: 'http://localhost:8080/list',
            method: 'get',
            success: function (data) {
                if (data.rows.length > 0) {
                    for (let index = 0; index < data.rows.length; index++) {
                        const newRow = $("<tr>");
                        let cols = "";
                        cols += '<td> ' + data.rows[index].fdc_id + '</td>';
                        cols += '<td> ' + data.rows[index].data_type + '</td>';
                        cols += '<td> ' + data.rows[index].description_ + '</td>';
                        newRow.append(cols);
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

